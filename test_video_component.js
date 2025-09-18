const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvqrovzrvmdhuehonfcq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs'
);

async function testVideoComponent() {
  try {
    console.log('🧪 Testando il componente video...\n');
    
    // Recupera la prima lezione con il suo video
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('"order"', 1)
      .single();
    
    if (lessonError) {
      console.log('❌ Errore nel recupero della lezione:', lessonError.message);
      return;
    }
    
    console.log(`✅ Lezione trovata: "${lesson.title}"`);
    
    // Recupera il video della lezione
    const { data: videoMaterial, error: videoError } = await supabase
      .from('materials')
      .select('*')
      .eq('lesson_id', lesson.id)
      .eq('type', 'video')
      .single();
    
    if (videoError) {
      console.log('❌ Errore nel recupero del video:', videoError.message);
      return;
    }
    
    console.log(`✅ Video trovato: "${videoMaterial.title}"`);
    console.log(`🔗 URL del video: ${videoMaterial.url}`);
    
    // Determina il tipo di video
    const isYouTube = videoMaterial.url.includes('youtube.com') || videoMaterial.url.includes('youtu.be');
    const isVimeo = videoMaterial.url.includes('vimeo.com');
    const isGoogleDrive = videoMaterial.url.includes('drive.google.com');
    const isDirectVideo = !isYouTube && !isVimeo && !isGoogleDrive;
    
    console.log('\n📊 Tipo di video:');
    console.log(`   - YouTube: ${isYouTube ? '✅' : '❌'}`);
    console.log(`   - Vimeo: ${isVimeo ? '✅' : '❌'}`);
    console.log(`   - Google Drive: ${isGoogleDrive ? '✅' : '❌'}`);
    console.log(`   - Video diretto: ${isDirectVideo ? '✅' : '❌'}`);
    
    if (isYouTube || isVimeo || isGoogleDrive) {
      console.log('\n⚠️  IMPORTANTE:');
      console.log('   Questo è un video iframe (YouTube/Vimeo/Google Drive)');
      console.log('   L\'evento onEnded non funziona con gli iframe');
      console.log('   Usa il pulsante "Video Completato" per simulare la fine del video');
    } else {
      console.log('\n✅ Questo è un video HTML5 diretto');
      console.log('   L\'evento onEnded dovrebbe funzionare automaticamente');
    }
    
    console.log('\n🎯 Per testare:');
    console.log('1. Vai alla lezione nel browser');
    console.log('2. Guarda il video');
    if (isYouTube || isVimeo || isGoogleDrive) {
      console.log('3. Clicca sul pulsante "Video Completato"');
    } else {
      console.log('3. Lascia che il video finisca naturalmente');
    }
    console.log('4. Dovrebbe apparire il messaggio di completamento');
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  }
}

testVideoComponent();
