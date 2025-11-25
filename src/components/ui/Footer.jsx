import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-950 py-12 mt-20 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold text-white mb-4">AsesoríasPro</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Conectamos estudiantes con expertos académicos. 
                            Potencia tu aprendizaje con cursos de calidad y asesorías personalizadas en tiempo real.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-semibold mb-4">Plataforma</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cursos</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Mentores</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Precios</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacidad</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Términos</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">© 2025 AsesoríasPro. Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5"/></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5"/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}