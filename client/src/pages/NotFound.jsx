import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-5xl font-extrabold neon-text">404</h2>
      <p className="opacity-80 mt-2">Página não encontrada.</p>
      <Link to="/" className="btn btn-primary mt-4">Voltar ao início</Link>
    </div>
  )
}
