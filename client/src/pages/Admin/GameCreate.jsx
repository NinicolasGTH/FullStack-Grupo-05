import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createGame} from '../../services/games.js';

export default function GameCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', description: '', genres: '', platforms: '', coverUrl: '', releaseDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onChange = (e) => setForm((f) => ({...f, [e.target.name]: e.target.value}));
    const splitToArray = (s) => s.split(',').map(x => x.trim()).filter(Boolean);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title || !form.description || !form.coverUrl || !form.releaseDate) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        const payload = {
            title: form.title,
            description: form.description,
            genres: splitToArray(form.genres),
            platforms: splitToArray(form.platforms),
            coverUrl: form.coverUrl,
            releaseDate: form.releaseDate
        };
        if (payload.genres.length === 0 || payload.platforms.length === 0) {
            setError('Gêneros e Plataformas devem conter ao menos um valor cada.');
            return;


        } try {
            setLoading(true);
            await createGame(payload);
            navigate('/games');
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
        
    };

    return (<div className="chat-container" style={{ maxWidth: 720, margin: '24px auto' }}>
      <div className="chat-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Voltar</button>
        <h2 className="text-2xl font-bold">🎮 Adicionar Jogo</h2>
      </div>

      <form className="card" onSubmit={onSubmit} style={{ padding: 16 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}

        <label className="label">Título</label>
        <input name="title" value={form.title} onChange={onChange} className="input" placeholder="Ex.: Hades II" />

        <label className="label" style={{ marginTop: 12 }}>Descrição</label>
        <textarea name="description" value={form.description} onChange={onChange} className="input" rows={4} placeholder="Sinopse do jogo..." />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div>
            <label className="label">Gêneros (vírgula)</label>
            <input name="genres" value={form.genres} onChange={onChange} className="input" placeholder="Roguelike, Ação" />
          </div>
          <div>
            <label className="label">Plataformas (vírgula)</label>
            <input name="platforms" value={form.platforms} onChange={onChange} className="input" placeholder="PC, PS5, Xbox Series" />
          </div>
        </div>

        <label className="label" style={{ marginTop: 12 }}>URL da Capa</label>
        <input name="coverUrl" value={form.coverUrl} onChange={onChange} className="input" placeholder="https://..." />

        <label className="label" style={{ marginTop: 12 }}>Data de lançamento</label>
        <input type="date" name="releaseDate" value={form.releaseDate} onChange={onChange} className="input" />

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Jogo'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/games')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
    );
}