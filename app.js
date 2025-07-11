// Inicialización de jsPDF
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navItems = document.querySelectorAll('.nav-menu li');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Botones de navegación
    const siguienteKnowHowBtn = document.getElementById('siguiente-know-how');
    const anteriorDescripcionBtn = document.getElementById('anterior-descripcion');
    const siguienteSolucionBtn = document.getElementById('siguiente-solucion');
    const anteriorKnowHowBtn = document.getElementById('anterior-know-how');
    const siguienteResponsabilidadBtn = document.getElementById('siguiente-responsabilidad');
    const anteriorSolucionBtn = document.getElementById('anterior-solucion');
    const siguienteResultadosBtn = document.getElementById('siguiente-resultados');
    const anteriorResponsabilidadBtn = document.getElementById('anterior-responsabilidad');
    
    // Botones de acción
    const guardarEvaluacionBtn = document.getElementById('guardar-evaluacion');
    const generarPdfBtn = document.getElementById('generar-pdf');
    
    // Modal
    const saveModal = document.getElementById('save-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const guardarPdfBtn = document.getElementById('guardar-pdf');
    const guardarLocalBtn = document.getElementById('guardar-local');
    const cancelarGuardarBtn = document.getElementById('cancelar-guardar');
    
    // Notificación
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // Lista de evaluaciones
    const listaEvaluaciones = document.getElementById('lista-evaluaciones');
    
    // Resultados
    const puntajeTotal = document.getElementById('puntaje-total');
    const nivelHay = document.getElementById('nivel-hay');
    const knowHowResult = document.getElementById('know-how-result');
    const problemasResult = document.getElementById('problemas-result');
    const responsabilidadResult = document.getElementById('responsabilidad-result');
    const knowHowNivel = document.getElementById('know-how-nivel');
    const problemasNivel = document.getElementById('problemas-nivel');
    const responsabilidadNivel = document.getElementById('responsabilidad-nivel');
    const perfilSugerido = document.getElementById('perfil-sugerido');

    // Tablas de referencia según metodología HAY
    const TABLAS_HAY = {
        // Tabla de Know-How (basada en la hoja "Know-How" del Excel)
        knowHow: {
            // Competencia Técnica/Especializada
            competencia: {
                'A': 38, 'B': 43, 'C': 50, 'D': 57, 'E': 66, 'F': 76, 'G': 87, 'H': 100
            },
            
            // Planificación, Organización e Integración
            planificacion: {
                'T': 1, 'I': 2, 'II': 3, 'III': 4, 'IV': 5
            },
            
            // Comunicación e Influencia
            comunicacion: {
                '1': 1, '2': 2, '3': 3
            },
            
            // Factores multiplicadores según combinación
            factores: {
                'T': { '1': 1.0, '2': 1.1, '3': 1.2 },
                'I': { '1': 1.1, '2': 1.2, '3': 1.3 },
                'II': { '1': 1.2, '2': 1.3, '3': 1.4 },
                'III': { '1': 1.3, '2': 1.4, '3': 1.5 },
                'IV': { '1': 1.4, '2': 1.5, '3': 1.6 }
            }
        },
        
        // Tabla de Solución de Problemas (basada en la hoja "Solución de Problemas" del Excel)
        solucionProblemas: {
            complejidad: {
                '1': 0.1, '2': 0.12, '3': 0.14, '4': 0.16, '5': 0.19,
                '6': 0.22, '7': 0.25, '8': 0.29, '9': 0.33, '10': 0.38,
                '11': 0.43, '12': 0.5, '13': 0.57, '14': 0.66, '15': 0.76, '16': 0.87
            },
            
            marcoReferencia: {
                'A': 0.1, 'B': 0.12, 'C': 0.14, 'D': 0.16, 'E': 0.19,
                'F': 0.22, 'G': 0.25, 'H': 0.29
            }
        },
        
        // Tabla de Responsabilidad (basada en la hoja "Responsabilidad" del Excel)
        responsabilidad: {
            libertad: {
                'A': 8, 'B': 10, 'C': 12, 'D': 14, 'E': 16, 'F': 19, 'G': 22, 'H': 25
            },
            
            impacto: {
                'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6
            },
            
            magnitud: {
                '1': 1, '2': 2, '3': 3, '4': 4, 'N': 5
            },
            
            // Tabla de puntajes de responsabilidad
            puntajes: {
                'A': { // Control Estricto
                    'I': [8, 10, 14, 19, 25, 33],
                    'II': [10, 12, 16, 22, 29, 38],
                    'III': [14, 19, 25, 33, 43, 57],
                    'IV': [19, 25, 33, 43, 57, 76],
                    'V': [25, 33, 43, 57, 76, 100]
                },
                'B': { // Control
                    'I': [10, 12, 16, 22, 29, 38],
                    'II': [12, 14, 19, 25, 33, 43],
                    'III': [16, 22, 29, 38, 50, 66],
                    'IV': [22, 29, 38, 50, 66, 87],
                    'V': [29, 38, 50, 66, 87, 115]
                },
                // ... (completar con todas las combinaciones)
                'H': { // Guía Estratégica
                    'I': [152, 200, 264, 350, 460, 608],
                    'II': [175, 230, 304, 400, 528, 700],
                    'III': [200, 264, 350, 460, 608, 800],
                    'IV': [230, 304, 400, 528, 700, 920],
                    'V': [264, 350, 460, 608, 800, 1056]
                }
            }
        },
        
        // Niveles HAY estándar
        nivelesHAY: [
            { min: 0, max: 100, nivel: "HAY I", descripcion: "Puestos operativos o técnicos" },
            { min: 101, max: 200, nivel: "HAY II", descripcion: "Profesionales junior" },
            { min: 201, max: 350, nivel: "HAY III", descripcion: "Profesionales senior" },
            { min: 351, max: 528, nivel: "HAY IV", descripcion: "Mandos medios" },
            { min: 529, max: 800, nivel: "HAY V", descripcion: "Alta dirección" },
            { min: 801, max: 1400, nivel: "HAY VI", descripcion: "Dirección ejecutiva" }
        ]
    };

    // Navegación
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            if (sectionId === 'evaluaciones') {
                cargarEvaluacionesGuardadas();
            }
        });
    });
    
    // Botones de navegación
    siguienteKnowHowBtn.addEventListener('click', function() {
        if (validarDescripcionPuesto()) {
            showSection('know-how');
        }
    });
    
    anteriorDescripcionBtn.addEventListener('click', function() {
        showSection('descripcion');
    });
    
    siguienteSolucionBtn.addEventListener('click', function() {
        showSection('solucion-problemas');
    });
    
    anteriorKnowHowBtn.addEventListener('click', function() {
        showSection('know-how');
    });
    
    siguienteResponsabilidadBtn.addEventListener('click', function() {
        showSection('responsabilidad');
    });
    
    anteriorSolucionBtn.addEventListener('click', function() {
        showSection('solucion-problemas');
    });
    
    siguienteResultadosBtn.addEventListener('click', function() {
        calcularResultados();
        showSection('resultados');
    });
    
    anteriorResponsabilidadBtn.addEventListener('click', function() {
        showSection('responsabilidad');
    });
    
    // Botones de acción
    guardarEvaluacionBtn.addEventListener('click', function() {
        saveModal.style.display = 'flex';
    });
    
    generarPdfBtn.addEventListener('click', function() {
        generarPDF();
    });
    
    // Modal
    closeModalBtn.addEventListener('click', function() {
        saveModal.style.display = 'none';
    });
    
    guardarPdfBtn.addEventListener('click', function() {
        generarPDF();
        saveModal.style.display = 'none';
    });
    
    guardarLocalBtn.addEventListener('click', function() {
        guardarEnLocalStorage();
        saveModal.style.display = 'none';
    });
    
    cancelarGuardarBtn.addEventListener('click', function() {
        saveModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === saveModal) {
            saveModal.style.display = 'none';
        }
    });
    
    // Funciones principales
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        document.querySelector(`#${sectionId}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function validarDescripcionPuesto() {
        const nombrePuesto = document.getElementById('nombre-puesto').value.trim();
        const areaDepartamento = document.getElementById('area-departamento').value.trim();
        const descripcionGeneral = document.getElementById('descripcion-general').value.trim();
        const responsabilidades = document.getElementById('responsabilidades').value.trim();
        
        if (!nombrePuesto || !areaDepartamento || !descripcionGeneral || !responsabilidades) {
            mostrarNotificacion('Por favor complete todos los campos requeridos', 'error');
            return false;
        }
        
        return true;
    }
    
    function calcularResultados() {
        // 1. Calcular Know-How según metodología HAY
        const competencia = document.getElementById('competencia-tecnica').value[0]; // Obtener la letra (A-H)
        const planificacion = document.getElementById('planificacion').value[0]; // Obtener la letra (T-IV)
        const comunicacion = document.getElementById('comunicacion').value[0]; // Obtener el número (1-3)
        
        const baseKH = TABLAS_HAY.knowHow.competencia[competencia];
        const factorKH = TABLAS_HAY.knowHow.factores[planificacion][comunicacion];
        const knowHowScore = Math.round(baseKH * factorKH);
        
        // 2. Calcular Solución de Problemas
        const complejidad = document.getElementById('complejidad').value[0]; // Número (1-5)
        const marcoRef = document.getElementById('marco-referencia').value[0]; // Letra (A-H)
        
        const factorSP = TABLAS_HAY.solucionProblemas.complejidad[complejidad] * 
                         TABLAS_HAY.solucionProblemas.marcoReferencia[marcoRef];
        const problemasScore = Math.round(knowHowScore * factorSP);
        
        // 3. Calcular Responsabilidad
        const libertad = document.getElementById('libertad-actuar').value[0]; // Letra (A-H)
        const impacto = document.getElementById('naturaleza-impacto').value[0]; // Letra (I-VI)
        const magnitud = document.getElementById('magnitud').value[0]; // Número (1-4) o N
        
        let magnitudIndex;
        if (magnitud === 'N') magnitudIndex = 4; // Para magnitud no cuantificada
        else magnitudIndex = parseInt(magnitud) - 1; // Convertir a índice (0-3)
        
        const impactoIndex = Math.min(Math.floor((TABLAS_HAY.responsabilidad.impacto[impacto] - 1) / 2), 4);
        const responsabilidadScore = TABLAS_HAY.responsabilidad.puntajes[libertad][impacto][magnitudIndex];
        
        // 4. Calcular total según fórmula HAY
        const total = knowHowScore + problemasScore + responsabilidadScore;
        
        // Mostrar resultados
        knowHowResult.textContent = knowHowScore;
        problemasResult.textContent = problemasScore;
        responsabilidadResult.textContent = responsabilidadScore;
        puntajeTotal.textContent = total;
        
        // Determinar nivel HAY
        const nivel = TABLAS_HAY.nivelesHAY.find(n => total >= n.min && total <= n.max) || 
                     { nivel: "No determinado", descripcion: "Fuera de rango estándar" };
        
        nivelHay.textContent = nivel.nivel;
        perfilSugerido.textContent = nivel.descripcion;
        
        // Determinar niveles individuales
        knowHowNivel.textContent = determinarNivelKnowHow(knowHowScore);
        problemasNivel.textContent = determinarNivelProblemas(problemasScore);
        responsabilidadNivel.textContent = determinarNivelResponsabilidad(responsabilidadScore);
    }
    
    function determinarNivelKnowHow(puntaje) {
        if (puntaje <= 50) return "Básico";
        if (puntaje <= 100) return "Introductorio";
        if (puntaje <= 200) return "Intermedio";
        if (puntaje <= 350) return "Avanzado";
        if (puntaje <= 528) return "Experto";
        return "Referente";
    }
    
    function determinarNivelProblemas(puntaje) {
        if (puntaje <= 25) return "Repetitivo";
        if (puntaje <= 50) return "Rutinario";
        if (puntaje <= 100) return "Variable";
        if (puntaje <= 200) return "Adaptativo";
        return "Estratégico";
    }
    
    function determinarNivelResponsabilidad(puntaje) {
        if (puntaje <= 50) return "Controlado";
        if (puntaje <= 100) return "Supervisado";
        if (puntaje <= 200) return "Autónomo";
        if (puntaje <= 350) return "Directivo";
        return "Estratégico";
    }
    
    function generarPDF() {
        // Obtener datos del formulario
        const nombrePuesto = document.getElementById('nombre-puesto').value;
        const areaDepartamento = document.getElementById('area-departamento').value;
        const descripcionGeneral = document.getElementById('descripcion-general').value;
        const responsabilidades = document.getElementById('responsabilidades').value.split('\n');
        
        // Obtener resultados
        const knowHow = knowHowResult.textContent;
        const problemas = problemasResult.textContent;
        const responsabilidad = responsabilidadResult.textContent;
        const total = puntajeTotal.textContent;
        const nivel = nivelHay.textContent;
        const perfil = perfilSugerido.textContent;
        
        // Crear PDF
        const doc = new jsPDF();
        
        // Portada
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text('Evaluación de Puesto - Metodología HAY', 105, 30, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text(nombrePuesto, 105, 50, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`Área/Departamento: ${areaDepartamento}`, 105, 65, { align: 'center' });
        doc.text(`Fecha de Evaluación: ${new Date().toLocaleDateString('es-ES')}`, 105, 75, { align: 'center' });
        
        // Resultados
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('Resultados de la Evaluación', 20, 30);
        
        // Tabla de resultados
        doc.autoTable({
            startY: 40,
            head: [['Factor', 'Puntaje', 'Nivel']],
            body: [
                ['Know-How', knowHow, knowHowNivel.textContent],
                ['Solución de Problemas', problemas, problemasNivel.textContent],
                ['Responsabilidad', responsabilidad, responsabilidadNivel.textContent],
                ['TOTAL', { content: total, styles: { fontStyle: 'bold' } }, nivel]
            ],
            theme: 'grid',
            headStyles: {
                fillColor: [44, 62, 80],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            }
        });
        
        // Perfil sugerido
        doc.setFontSize(14);
        doc.text(`Perfil Sugerido: ${perfil}`, 20, doc.autoTable.previous.finalY + 20);
        
        // Descripción del puesto
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('Descripción del Puesto', 20, 30);
        
        doc.setFontSize(14);
        doc.text('Descripción General:', 20, 45);
        doc.text(descripcionGeneral, 20, 55, { maxWidth: 170 });
        
        doc.text('Responsabilidades Principales:', 20, doc.previousAutoTable ? doc.previousAutoTable.finalY + 30 : 100);
        
        let yPos = doc.previousAutoTable ? doc.previousAutoTable.finalY + 40 : 110;
        responsabilidades.forEach(responsabilidad => {
            if (responsabilidad.trim()) {
                doc.setFontSize(12);
                doc.text('• ' + responsabilidad.trim(), 25, yPos, { maxWidth: 160 });
                yPos += 7;
            }
        });
        
        // Guardar PDF
        doc.save(`Evaluacion_HAY_${nombrePuesto.replace(/ /g, '_')}.pdf`);
        mostrarNotificacion('PDF generado con éxito', 'success');
    }
    
    function guardarEnLocalStorage() {
        // Obtener datos del formulario
        const nombrePuesto = document.getElementById('nombre-puesto').value;
        const areaDepartamento = document.getElementById('area-departamento').value;
        const descripcionGeneral = document.getElementById('descripcion-general').value;
        const responsabilidades = document.getElementById('responsabilidades').value;
        
        // Obtener resultados
        const evaluacion = {
            id: Date.now(),
            nombrePuesto,
            areaDepartamento,
            descripcionGeneral,
            responsabilidades,
            knowHow: knowHowResult.textContent,
            problemas: problemasResult.textContent,
            responsabilidad: responsabilidadResult.textContent,
            total: puntajeTotal.textContent,
            nivel: nivelHay.textContent,
            perfil: perfilSugerido.textContent,
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage
        let evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
        evaluaciones.push(evaluacion);
        localStorage.setItem('evaluacionesHAY', JSON.stringify(evaluaciones));
        
        mostrarNotificacion('Evaluación guardada localmente', 'success');
        cargarEvaluacionesGuardadas();
    }
    
    function cargarEvaluacionesGuardadas() {
        const evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
        
        if (evaluaciones.length === 0) {
            listaEvaluaciones.innerHTML = '<p class="no-evaluations">No hay evaluaciones guardadas.</p>';
            return;
        }
        
        listaEvaluaciones.innerHTML = '';
        
        evaluaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(evaluacion => {
            const fecha = new Date(evaluacion.fecha).toLocaleDateString('es-ES');
            
            const evaluacionElement = document.createElement('div');
            evaluacionElement.className = 'evaluation-item';
            evaluacionElement.innerHTML = `
                <div class="evaluation-info">
                    <h3>${evaluacion.nombrePuesto}</h3>
                    <p>${evaluacion.areaDepartamento} | Puntaje: ${evaluacion.total} (${evaluacion.nivel})</p>
                    <p><small>Evaluado el ${fecha}</small></p>
                </div>
                <div class="evaluation-actions">
                    <button class="btn-secondary" onclick="verEvaluacion(${evaluacion.id})">Ver</button>
                    <button class="btn-secondary" onclick="eliminarEvaluacion(${evaluacion.id})">Eliminar</button>
                </div>
            `;
            
            listaEvaluaciones.appendChild(evaluacionElement);
        });
    }
    
    function mostrarNotificacion(mensaje, tipo = 'success') {
        notificationMessage.textContent = mensaje;
        
        if (tipo === 'error') {
            notification.style.backgroundColor = 'var(--error-color)';
        } else if (tipo === 'warning') {
            notification.style.backgroundColor = 'var(--warning-color)';
        } else {
            notification.style.backgroundColor = 'var(--success-color)';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Funciones globales
    window.verEvaluacion = function(id) {
        const evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
        const evaluacion = evaluaciones.find(e => e.id === id);
        
        if (evaluacion) {
            // Llenar descripción
            document.getElementById('nombre-puesto').value = evaluacion.nombrePuesto;
            document.getElementById('area-departamento').value = evaluacion.areaDepartamento;
            document.getElementById('descripcion-general').value = evaluacion.descripcionGeneral;
            document.getElementById('responsabilidades').value = evaluacion.responsabilidades;
            
            // Mostrar resultados
            knowHowResult.textContent = evaluacion.knowHow;
            problemasResult.textContent = evaluacion.problemas;
            responsabilidadResult.textContent = evaluacion.responsabilidad;
            puntajeTotal.textContent = evaluacion.total;
            nivelHay.textContent = evaluacion.nivel;
            perfilSugerido.textContent = evaluacion.perfil;
            
            // Ir a resultados
            showSection('resultados');
            mostrarNotificacion(`Evaluación de "${evaluacion.nombrePuesto}" cargada`);
        }
    };
    
    window.eliminarEvaluacion = function(id) {
        if (confirm('¿Está seguro que desea eliminar esta evaluación?')) {
            let evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
            evaluaciones = evaluaciones.filter(e => e.id !== id);
            localStorage.setItem('evaluacionesHAY', JSON.stringify(evaluaciones));
            cargarEvaluacionesGuardadas();
            mostrarNotificacion('Evaluación eliminada', 'success');
        }
    };
    
    // Inicialización
    cargarEvaluacionesGuardadas();
});