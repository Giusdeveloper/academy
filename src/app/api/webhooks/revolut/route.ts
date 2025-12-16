import { NextRequest, NextResponse } from 'next/server';
import { revolutService } from '@/lib/revolut-service';
import { RevolutWebhookPayload } from '@/config/revolut';
import { supabase } from '@/config/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('revolut-signature');

    // Verifica la firma del webhook
    if (!signature || !revolutService.verifyWebhookSignature(body, signature)) {
      console.error('Firma webhook non valida');
      return NextResponse.json(
        { error: 'Firma non valida' },
        { status: 401 }
      );
    }

    const payload: RevolutWebhookPayload = JSON.parse(body);
    const { type, data } = payload;

    console.log(`Webhook Revolut ricevuto: ${type}`, data);

    // Aggiorna lo stato del pagamento nel database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: data.state,
        updated_at: new Date().toISOString(),
      })
      .eq('revolut_payment_id', data.id);

    if (updateError) {
      console.error('Errore nell\'aggiornamento del pagamento:', updateError);
    }

    // Se il pagamento è completato, iscrivi l'utente al corso
    if (type === 'PaymentCompleted' && data.state === 'COMPLETED') {
      try {
        // Recupera i dettagli del pagamento
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('course_id, user_email')
          .eq('revolut_payment_id', data.id)
          .single();

        if (paymentError || !payment) {
          console.error('Pagamento non trovato nel database:', paymentError);
          return NextResponse.json({ success: true });
        }

        // Iscrivi l'utente al corso
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            course_id: payment.course_id,
            user_email: payment.user_email,
            enrolled_at: new Date().toISOString(),
            payment_id: data.id,
          });

        if (enrollmentError) {
          console.error('Errore nell\'iscrizione al corso:', enrollmentError);
        } else {
          console.log(`Utente ${payment.user_email} iscritto al corso ${payment.course_id}`);
        }

      } catch (error) {
        console.error('Errore nel processo di iscrizione:', error);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Errore nel webhook Revolut:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
