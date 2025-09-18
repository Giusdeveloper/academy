export default function HomePage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Academy Imment - Test</h1>
      <p>Se vedi questa pagina, il sito funziona!</p>
      <p>Data: {new Date().toLocaleString()}</p>
    </div>
  );
}