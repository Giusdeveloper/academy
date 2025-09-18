const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvqrovzrvmdhuehonfcq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs'
);

async function monitorApp() {
  console.log('🔍 Monitoraggio dell\'applicazione...\n');
  
  // Controlla lo stato delle tabelle
  console.log('📊 Stato del database:');
  
  try {
    // Conta le lezioni
    const { count: lessonsCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   - Lezioni: ${lessonsCount || 0}`);
    
    // Conta i materiali
    const { count: materialsCount } = await supabase
      .from('materials')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   - Materiali: ${materialsCount || 0}`);
    
    // Conta i video
    const { count: videosCount } = await supabase
      .from('materials')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'video');
    
    console.log(`   - Video: ${videosCount || 0}`);
    
    // Conta i corsi
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   - Corsi: ${coursesCount || 0}`);
    
    // Conta il progresso
    const { count: progressCount } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   - Record di progresso: ${progressCount || 0}`);
    
  } catch (error) {
    console.log('❌ Errore nel monitoraggio:', error.message);
  }
  
  console.log('\n🌐 Applicazione disponibile su: http://localhost:3000');
  console.log('\n📋 Per testare:');
  console.log('1. Apri http://localhost:3000');
  console.log('2. Vai al corso "Finanziamento Aziendale"');
  console.log('3. Clicca sulla prima lezione');
  console.log('4. Guarda il video');
  console.log('5. Verifica che appaia il messaggio per il quiz');
  
  console.log('\n⏰ Monitoraggio attivo... (Ctrl+C per uscire)');
  
  // Monitora ogni 30 secondi
  setInterval(async () => {
    try {
      const { count: progressCount } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true });
      
      if (progressCount > 0) {
        console.log(`\n🔄 Aggiornamento: ${progressCount} record di progresso trovati`);
      }
    } catch (error) {
      // Ignora errori di monitoraggio
    }
  }, 30000);
}

monitorApp();
