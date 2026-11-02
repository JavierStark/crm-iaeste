// Componentes básicos compartidos por App.jsx y Configuracion.jsx

export const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 ${props.className || ''}`}
  />
)

export const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
)

export const Btn = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-brand-900 hover:bg-brand-700 text-white shadow-sm shadow-brand-900/20 active:scale-[0.98]',
    ghost: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    danger: 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200',
  }
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

// Aviso de ancho completo (info / éxito / alerta / error)
const AVISO_TONOS = {
  info: 'border-brand-200 bg-brand-50 text-brand-900',
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warn: 'border-amber-300 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  neutral: 'border-slate-200 bg-white text-slate-600',
}
export const Aviso = ({ tono = 'info', icono: Icono, children, className = '' }) => (
  <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${AVISO_TONOS[tono]} ${className}`}>
    {Icono && <Icono className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />}
    <div className="min-w-0 flex-1">{children}</div>
  </div>
)

