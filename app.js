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
    const nuevaEvaluacionBtn = document.getElementById('nueva-evaluacion');
    const nuevaEvaluacionBtn2 = document.getElementById('nueva-evaluacion-2');
    
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
    const perfilCorto = document.getElementById('perfil-corto');

    // Tablas de referencia según metodología HAY (actualizadas según la planilla)
    const TABLAS_HAY = {
        knowHow: {
            competencia: {
                'A': 38, 'B': 43, 'C': 50, 'D': 57, 'E': 66, 'F': 76, 'G': 87, 'H': 100
            },
            
            planificacion: {
                'T': { '1': 38, '2': 43, '3': 50 },
                'I': { '1': 50, '2': 57, '3': 66 },
                'II': { '1': 66, '2': 76, '3': 87 },
                'III': { '1': 87, '2': 100, '3': 115 },
                'IV': { '1': 115, '2': 132, '3': 152 }
            },
            
            comunicacion: {
                '1': 1.0, '2': 1.1, '3': 1.2
            }
        },
        
        solucionProblemas: {
            complejidad: {
                '1': 0.1, '2': 0.12, '3': 0.14, '4': 0.16, '5': 0.19
            },
            
            marcoReferencia: {
                'A': 0.1, 'B': 0.12, 'C': 0.14, 'D': 0.16, 'E': 0.19,
                'F': 0.22, 'G': 0.25, 'H': 0.29
            }
        },
        
        responsabilidad: {
            libertad: {
                'A': [8, 10, 14, 19, 25, 33],
                'B': [10, 12, 16, 22, 29, 38],
                'C': [12, 14, 19, 25, 33, 43],
                'D': [14, 16, 22, 29, 38, 50],
                'E': [16, 19, 25, 33, 43, 57],
                'F': [19, 22, 29, 38, 50, 66],
                'G': [22, 25, 33, 43, 57, 76],
                'H': [25, 29, 38, 50, 66, 87]
            },
            
            impacto: {
                'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5
            },
            
            magnitud: {
                '1': 0, '2': 1, '3': 2, '4': 3, 'N': 4
            }
        },
        
        nivelesHAY: [
            { min: 0, max: 100, nivel: "HAY 1", descripcion: "Puestos operativos o técnicos" },
            { min: 101, max: 200, nivel: "HAY 2", descripcion: "Profesionales junior" },
            { min: 201, max: 350, nivel: "HAY 3", descripcion: "Profesionales senior" },
            { min: 351, max: 528, nivel: "HAY 4", descripcion: "Mandos medios" },
            { min: 529, max: 800, nivel: "HAY 5", descripcion: "Alta dirección" },
            { min: 801, max: 1400, nivel: "HAY 6", descripcion: "Dirección ejecutiva" }
        ],
        
        perfilesCortos: {
            'P1': { min: 0, max: 100, descripcion: "Perfil operativo básico" },
            'P2': { min: 101, max: 200, descripcion: "Perfil técnico especializado" },
            'P3': { min: 201, max: 350, descripcion: "Perfil profesional" },
            'P4': { min: 351, max: 528, descripcion: "Perfil de mando medio" },
            'A1': { min: 529, max: 800, descripcion: "Perfil de alta dirección" },
            'A2': { min: 801, max: 1056, descripcion: "Perfil directivo estratégico" },
            'A3': { min: 1057, max: 1400, descripcion: "Perfil ejecutivo" }
        }
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
    
    // Nueva evaluación
    nuevaEvaluacionBtn.addEventListener('click', resetearEvaluacion);
    nuevaEvaluacionBtn2.addEventListener('click', resetearEvaluacion);
    
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
        try {
            // 1. Calcular Know-How
            const competenciaSelect = document.getElementById('competencia-tecnica');
            const competenciaValue = parseInt(competenciaSelect.value);

            const planificacionSelect = document.getElementById('planificacion');
            const planificacionKey = planificacionSelect.value;

            const comunicacionSelect = document.getElementById('comunicacion');
            const comunicacionKey = comunicacionSelect.value;

            // Obtener valor base de planificación según la tabla
            let planificacionValue = 0;
            if (planificacionKey === 'T') {
                planificacionValue = TABLAS_HAY.knowHow.planificacion.T[comunicacionKey];
            } else if (planificacionKey === 'I') {
                planificacionValue = TABLAS_HAY.knowHow.planificacion.I[comunicacionKey];
            } else if (planificacionKey === 'II') {
                planificacionValue = TABLAS_HAY.knowHow.planificacion.II[comunicacionKey];
            } else if (planificacionKey === 'III') {
                planificacionValue = TABLAS_HAY.knowHow.planificacion.III[comunicacionKey];
            } else if (planificacionKey === 'IV') {
                planificacionValue = TABLAS_HAY.knowHow.planificacion.IV[comunicacionKey];
            }

            // Calcular Know-How según metodología HAY
            const knowHowScore = Math.round(competenciaValue + planificacionValue);
            
            // 2. Calcular Solución de Problemas
            const complejidadSelect = document.getElementById('complejidad');
            const complejidadKey = complejidadSelect.value;
            const porcentajeComplejidad = TABLAS_HAY.solucionProblemas.complejidad[complejidadKey];

            const marcoRefSelect = document.getElementById('marco-referencia');
            const marcoRefKey = marcoRefSelect.value;
            const porcentajeMarcoRef = parseFloat(marcoRefKey);

            const problemasScore = Math.round(knowHowScore * porcentajeComplejidad * porcentajeMarcoRef);
            
            // 3. Calcular Responsabilidad
            const libertadSelect = document.getElementById('libertad-actuar');
            const libertadKey = libertadSelect.value;
            const libertadValues = TABLAS_HAY.responsabilidad.libertad[libertadKey] || [0, 0, 0, 0, 0, 0];

            const impactoSelect = document.getElementById('naturaleza-impacto');
            const impactoKey = impactoSelect.value;
            const impactoIndex = TABLAS_HAY.responsabilidad.impacto[impactoKey] || 0;

            const magnitudSelect = document.getElementById('magnitud');
            const magnitudKey = magnitudSelect.value;
            const magnitudIndex = TABLAS_HAY.responsabilidad.magnitud[magnitudKey] || 0;

            // Asegurarse de que los índices no excedan los límites
            const index = Math.min(impactoIndex + magnitudIndex, libertadValues.length - 1);
            const responsabilidadScore = libertadValues[index] || 0;
            
            // 4. Calcular total
            const total = knowHowScore + problemasScore + responsabilidadScore;
            
            // Mostrar resultados
            knowHowResult.textContent = knowHowScore;
            problemasResult.textContent = problemasScore;
            responsabilidadResult.textContent = responsabilidadScore;
            puntajeTotal.textContent = total;
            
            // Determinar nivel HAY
            const nivel = TABLAS_HAY.nivelesHAY.find(n => total >= n.min && total <= n.max) || 
                         { nivel: "HAY No determinado", descripcion: "Fuera de rango estándar" };
            
            nivelHay.textContent = nivel.nivel;
            perfilSugerido.textContent = nivel.descripcion;
            
            // Determinar niveles individuales
            knowHowNivel.textContent = determinarNivelKnowHow(knowHowScore);
            problemasNivel.textContent = determinarNivelProblemas(problemasScore);
            responsabilidadNivel.textContent = determinarNivelResponsabilidad(responsabilidadScore);
            
            // Mostrar perfil corto
            mostrarPerfilCorto(total);
            
        } catch (error) {
            console.error('Error al calcular resultados:', error);
            mostrarNotificacion('Error al calcular los resultados. Por favor revise los datos ingresados.', 'error');
        }
    }
    
    function mostrarPerfilCorto(puntajeTotal) {
        let perfil = '';
        
        // Determinar perfil según puntaje
        if (puntajeTotal <= 100) {
            perfil = 'P1';
        } else if (puntajeTotal <= 200) {
            perfil = 'P2';
        } else if (puntajeTotal <= 350) {
            perfil = 'P3';
        } else if (puntajeTotal <= 528) {
            perfil = 'P4';
        } else if (puntajeTotal <= 800) {
            perfil = 'A1';
        } else if (puntajeTotal <= 1056) {
            perfil = 'A2';
        } else {
            perfil = 'A3';
        }
        
        const perfilInfo = TABLAS_HAY.perfilesCortos[perfil] || { descripcion: 'Perfil no determinado' };
        
        perfilCorto.innerHTML = `
            <h4>Perfil Corto: ${perfil}</h4>
            <p>${perfilInfo.descripcion}</p>
        `;
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
    
    function resetearEvaluacion() {
        // Limpiar formulario
        document.getElementById('nombre-puesto').value = '';
        document.getElementById('area-departamento').value = '';
        document.getElementById('descripcion-general').value = '';
        document.getElementById('responsabilidades').value = '';
        
        // Resetear selects a valores por defecto
        document.getElementById('competencia-tecnica').selectedIndex = 2;
        document.getElementById('planificacion').selectedIndex = 1;
        document.getElementById('comunicacion').selectedIndex = 1;
        document.getElementById('complejidad').selectedIndex = 2;
        document.getElementById('marco-referencia').selectedIndex = 3;
        document.getElementById('libertad-actuar').selectedIndex = 2;
        document.getElementById('naturaleza-impacto').selectedIndex = 2;
        document.getElementById('magnitud').selectedIndex = 2;
        
        // Resetear resultados
        knowHowResult.textContent = '0';
        problemasResult.textContent = '0';
        responsabilidadResult.textContent = '0';
        puntajeTotal.textContent = '0';
        nivelHay.textContent = '-';
        perfilSugerido.textContent = 'Complete la evaluación para ver el perfil sugerido';
        knowHowNivel.textContent = '-';
        problemasNivel.textContent = '-';
        responsabilidadNivel.textContent = '-';
        perfilCorto.innerHTML = '';
        
        // Volver a la primera sección
        showSection('descripcion');
        
        // Resetear navegación
        navItems.forEach(navItem => navItem.classList.remove('active'));
        document.querySelector('[data-section="descripcion"]').classList.add('active');
        
        mostrarNotificacion('Nueva evaluación iniciada', 'success');
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
        const perfilCortoText = perfilCorto.textContent;
        
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
        
        // Perfil corto
        doc.setFontSize(12);
        doc.text(perfilCortoText, 20, doc.autoTable.previous.finalY + 30);
        
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
            perfilCorto: perfilCorto.textContent,
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
            perfilCorto.textContent = evaluacion.perfilCorto || '';
            
            // Determinar niveles individuales
            knowHowNivel.textContent = determinarNivelKnowHow(parseInt(evaluacion.knowHow));
            problemasNivel.textContent = determinarNivelProblemas(parseInt(evaluacion.problemas));
            responsabilidadNivel.textContent = determinarNivelResponsabilidad(parseInt(evaluacion.responsabilidad));
            
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