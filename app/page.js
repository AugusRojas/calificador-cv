'use client';

import { useState } from 'react';

const INITIAL_FORM = {
  rol: 'Desarrollador/a Frontend',
  seniority: 'Semi Senior',
  cv: '',
};

export default function HomePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('No se pudo evaluar el CV.');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Asistente de RRHH · Calificador de CV</h1>
      <p className="subtitle">
        Pegá un CV y obtené una puntuación con fortalezas, vacíos y recomendaciones concretas.
      </p>

      <div className="grid">
        <form className="card" onSubmit={onSubmit}>
          <label htmlFor="rol">Rol objetivo</label>
          <input id="rol" value={form.rol} onChange={onChange('rol')} />

          <label htmlFor="seniority" style={{ marginTop: '0.9rem' }}>Senioridad</label>
          <select id="seniority" value={form.seniority} onChange={onChange('seniority')}>
            <option>Junior</option>
            <option>Semi Senior</option>
            <option>Senior</option>
            <option>Líder Técnico</option>
          </select>

          <label htmlFor="cv" style={{ marginTop: '0.9rem' }}>Texto del CV</label>
          <textarea
            id="cv"
            placeholder="Ejemplo: 3 años de experiencia con React, TypeScript, testing..."
            value={form.cv}
            onChange={onChange('cv')}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Evaluando...' : 'Evaluar CV'}
          </button>
          <p className="small">No se almacena información personal.</p>
          {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
        </form>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>Resultado</h2>
          {!resultado ? (
            <p className="small">Completá el formulario para ver el análisis.</p>
          ) : (
            <>
              <p className="score">{resultado.score}/100</p>
              <p className="small">Nivel estimado: {resultado.nivel}</p>

              <h3>Fortalezas</h3>
              <div>
                {resultado.fortalezas.map((item) => (
                  <span className="pill" key={item}>{item}</span>
                ))}
              </div>

              <h3>Brechas detectadas</h3>
              <ul className="list">
                {resultado.brechas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>Recomendaciones</h3>
              <ul className="list">
                {resultado.recomendaciones.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
