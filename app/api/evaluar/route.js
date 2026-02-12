import { NextResponse } from 'next/server';

const SKILLS_BASE = [
  'react',
  'javascript',
  'typescript',
  'node',
  'api',
  'sql',
  'testing',
  'aws',
  'scrum',
  'liderazgo',
];

function getNivel(score) {
  if (score >= 85) return 'Muy competitivo';
  if (score >= 70) return 'Competitivo';
  if (score >= 50) return 'Con potencial';
  return 'Necesita mejoras';
}

export async function POST(req) {
  const { cv = '', rol = '', seniority = '' } = await req.json();
  const cvText = cv.toLowerCase();

  const matches = SKILLS_BASE.filter((skill) => cvText.includes(skill));
  const yearsMatch = cvText.match(/(\d+)\s*(años|anos)/i);
  const years = yearsMatch ? Number(yearsMatch[1]) : 0;

  let score = 30 + matches.length * 6 + Math.min(years, 10) * 3;

  if (seniority.toLowerCase().includes('junior')) {
    score += years >= 1 ? 6 : 0;
  } else if (seniority.toLowerCase().includes('semi')) {
    score += years >= 2 ? 8 : -5;
  } else if (seniority.toLowerCase().includes('senior')) {
    score += years >= 5 ? 10 : -8;
  }

  score = Math.max(0, Math.min(100, score));

  const faltantes = SKILLS_BASE.filter((skill) => !matches.includes(skill)).slice(0, 4);
  const fortalezas = matches.slice(0, 6);

  const recomendaciones = [
    `Alinear el perfil con resultados cuantificables para el rol ${rol || 'objetivo'}.`,
    'Agregar un resumen profesional de 4-6 líneas al inicio del CV.',
    faltantes.length
      ? `Incluir evidencia concreta de: ${faltantes.join(', ')}.`
      : 'Mantener foco en logros de impacto y métricas del negocio.',
  ];

  return NextResponse.json({
    score,
    nivel: getNivel(score),
    fortalezas: fortalezas.length ? fortalezas : ['Comunicación del perfil profesional'],
    brechas: faltantes.length ? faltantes : ['Profundizar logros con métricas de negocio'],
    recomendaciones,
  });
}
