import { NextRequest, NextResponse } from 'next/server';
import { revolutService } from '@/lib/revolut-service';
import { supabase } from '@/config/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, userEmail, userName } = body;

    // Validazione input
    if (!courseId || !userEmail) {
      return NextResponse.json(
        { error: 'Course ID e email utente sono richiesti' },
        { status: 400 }
      );
    }

    // Recupera i dettagli del corso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Corso non trovato' },
        { status: 404 }
      );
    }

    // Verifica se il corso è a pagamento
    if (course.price <= 0) {
      return NextResponse.json(
        { error: 'Questo corso è gratuito' },
        { status: 400 }
      );
    }

    // Crea il pagamento con Revolut
    const payment = await revolutService.createCoursePayment(
      courseId,
      course.title,
      course.price,
      userEmail,
      userName
    );

    // Salva il pagamento nel database per tracking
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        id: payment.id,
        public_id: payment.public_id,
        course_id: courseId,
        user_email: userEmail,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.state,
        order_id: payment.order_id,
        revolut_payment_id: payment.id,
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Errore nel salvataggio del pagamento:', paymentError);
      // Non blocchiamo il processo se il salvataggio fallisce
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        public_id: payment.public_id,
        checkout_url: payment.checkout_url,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.state,
      },
    });

  } catch (error) {
    console.error('Errore nella creazione del pagamento:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
