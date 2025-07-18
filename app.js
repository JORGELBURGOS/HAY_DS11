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

    // Tablas de referencia según metodología HAY (actualizadas y corregidas)
    const TABLAS_HAY = {
        knowHow: {
            // Valores directos de competencia técnica (columna E en Excel)
            competencia: {
                '38': 38, '43': 43, '50': 50, '57': 57, '66': 66, 
                '76': 76, '87': 87, '100': 100, '115': 115, '132': 132,
                '152': 152, '175': 175
            },
            
            // Valores de planificación/organización (filas 7-11 en Excel)
            planificacion: {
                'T': 1,  // Focalizado en tareas
                'I': 2,   // Específica
                'II': 3,  // Homogénea/Relacionada
                'III': 4, // Heterogénea/Diversa
                'IV': 5   // Amplia
            },
            
            // Factores de comunicación (columna B en Excel)
            comunicacion: {
                '1': 1.0, // Comunica
                '2': 1.1, // Razonamiento
                '3': 1.2  // Cambio de comportamientos
            }
        },
        
        solucionProblemas: {
            // Porcentajes de complejidad (filas 32-36 en Excel)
            complejidad: {
                '1': 0.12, // Repetitivo
                '2': 0.22, // Con modelos
                '3': 0.33, // Variable
                '4': 0.48, // Adaptación
                '5': 0.66  // Sin precedentes
            },
            
            // Porcentajes de marco de referencia (filas 41-48 en Excel)
            marcoReferencia: {
                'A': 0.12, // Rutina Estricta
                'B': 0.16, // Rutina
                'C': 0.22, // Semi-Rutina
                'D': 0.29, // Estandarizado
                'E': 0.38, // Definición Clara
                'F': 0.48, // Definición Amplia
                'G': 0.57, // Definición Genérica
                'H': 0.66  // Abstracto
            }
        },
        
        responsabilidad: {
            // Valores base según libertad para actuar (filas 7-14 en Excel)
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
            
            // Índices para naturaleza del impacto
            impacto: {
                'I': 0,    // Controlado
                'II': 1,   // Consultivo
                'III': 2,  // Servicio/Asesoría
                'IV': 3,   // Operativo
                'V': 4,    // Consultivo Liderazgo
                'VI': 5    // Estratégico
            },
            
            // Índices para magnitud
            magnitud: {
                '1': 0,    // Muy pequeño
                '2': 1,    // Pequeño
                '3': 2,    // Medio
                '4': 3,    // Grande
                'N': 3     // No cuantificada (se considera como Grande)
            }
        },
        
        // Niveles HAY según puntaje total
        nivelesHAY: [
            { min: 0, max: 100, nivel: "HAY 1", descripcion: "Puestos operativos o técnicos" },
            { min: 101, max: 200, nivel: "HAY 2", descripcion: "Profesionales junior" },
            { min: 201, max: 350, nivel: "HAY 3", descripcion: "Profesionales senior" },
            { min: 351, max: 528, nivel: "HAY 4", descripcion: "Mandos medios" },
            { min: 529, max: 800, nivel: "HAY 5", descripcion: "Alta dirección" },
            { min: 801, max: 1400, nivel: "HAY 6", descripcion: "Dirección ejecutiva" }
        ],
        
        // Perfiles cortos según puntaje
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
    if (nuevaEvaluacionBtn) nuevaEvaluacionBtn.addEventListener('click', resetearEvaluacion);
    if (nuevaEvaluacionBtn2) nuevaEvaluacionBtn2.addEventListener('click', resetearEvaluacion);
    
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
            // 1. Cálculo de Know-How (KH)
            const competenciaValue = parseInt(document.getElementById('competencia-tecnica').value);
            
            const planificacionKey = document.getElementById('planificacion').value;
            const planificacionFactor = TABLAS_HAY.knowHow.planificacion[planificacionKey];
            
            const comunicacionKey = document.getElementById('comunicacion').value;
            const comunicacionFactor = TABLAS_HAY.knowHow.comunicacion[comunicacionKey];
            
            // Fórmula corregida: KH = Competencia * Comunicación + Planificación
            const knowHowScore = Math.round(competenciaValue * comunicacionFactor + (planificacionFactor * 10));
            
            // 2. Cálculo de Solución de Problemas (SP)
            const complejidadKey = document.getElementById('complejidad').value;
            const complejidadFactor = TABLAS_HAY.solucionProblemas.complejidad[complejidadKey];
            
            const marcoRefKey = document.getElementById('marco-referencia').value;
            const marcoRefFactor = TABLAS_HAY.solucionProblemas.marcoReferencia[marcoRefKey];
            
            // Fórmula corregida: SP = KH * %Complejidad * %MarcoReferencia
            const problemasScore = Math.round(knowHowScore * complejidadFactor * marcoRefFactor);
            
            // 3. Cálculo de Responsabilidad (AC)
            const libertadKey = document.getElementById('libertad-actuar').value;
            const libertadValues = TABLAS_HAY.responsabilidad.libertad[libertadKey];
            
            const impactoKey = document.getElementById('naturaleza-impacto').value;
            const impactoIndex = TABLAS_HAY.responsabilidad.impacto[impactoKey];
            
            const magnitudKey = document.getElementById('magnitud').value;
            const magnitudIndex = TABLAS_HAY.responsabilidad.magnitud[magnitudKey];
            
            // Índice correcto para responsabilidad
            const responsabilidadIndex = Math.min(impactoIndex + magnitudIndex, libertadValues.length - 1);
            const responsabilidadScore = libertadValues[responsabilidadIndex];
            
            // 4. Puntaje Total = KH + SP + AC
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