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
    
    // Niveles HAY basados en el puntaje total
    const nivelesHAY = [
        { min: 0, max: 100, nivel: "Operativo/Técnico", descripcion: "Puestos operativos con responsabilidad limitada" },
        { min: 101, max: 200, nivel: "Profesional Especializado", descripcion: "Profesionales con responsabilidad sobre procesos específicos" },
        { min: 201, max: 350, nivel: "Mando Medio", descripcion: "Puestos con responsabilidad sobre áreas o departamentos" },
        { min: 351, max: 528, nivel: "Alta Dirección", descripcion: "Puestos con responsabilidad estratégica y organizacional" },
        { min: 529, max: 1400, nivel: "Dirección Ejecutiva", descripcion: "Máxima responsabilidad estratégica en la organización" }
    ];
    
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
    
    // Funciones
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Scroll suave al inicio de la sección
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
        // Obtener valores de Know-How
        const competenciaTecnica = parseInt(document.getElementById('competencia-tecnica').value);
        const planificacion = parseInt(document.getElementById('planificacion').value);
        const comunicacion = parseInt(document.getElementById('comunicacion').value);
        
        // Calcular Know-How según tabla
        let knowHowScore = 0;
        if (planificacion === 1) {
            knowHowScore = competenciaTecnica;
        } else if (planificacion === 2) {
            knowHowScore = competenciaTecnica + (comunicacion === 1 ? 5 : comunicacion === 2 ? 7 : 10);
        } else if (planificacion === 3) {
            knowHowScore = competenciaTecnica + (comunicacion === 1 ? 10 : comunicacion === 2 ? 15 : 20);
        } else if (planificacion === 4) {
            knowHowScore = competenciaTecnica + (comunicacion === 1 ? 15 : comunicacion === 2 ? 20 : 25);
        } else if (planificacion === 5) {
            knowHowScore = competenciaTecnica + (comunicacion === 1 ? 20 : comunicacion === 2 ? 25 : 30);
        }
        
        // Obtener valores de Solución de Problemas
        const complejidad = parseInt(document.getElementById('complejidad').value);
        const marcoReferencia = parseFloat(document.getElementById('marco-referencia').value);
        
        // Calcular Solución de Problemas según tabla
        const problemasScore = knowHowScore * marcoReferencia;
        
        // Obtener valores de Responsabilidad
        const libertadActuar = parseInt(document.getElementById('libertad-actuar').value);
        const naturalezaImpacto = parseInt(document.getElementById('naturaleza-impacto').value);
        const magnitud = parseInt(document.getElementById('magnitud').value);
        
        // Calcular Responsabilidad según tabla
        let responsabilidadScore = 0;
        if (magnitud === 1) {
            responsabilidadScore = libertadActuar + (naturalezaImpacto * 5);
        } else if (magnitud === 2) {
            responsabilidadScore = libertadActuar + (naturalezaImpacto * 10);
        } else if (magnitud === 3) {
            responsabilidadScore = libertadActuar + (naturalezaImpacto * 15);
        } else if (magnitud === 4) {
            responsabilidadScore = libertadActuar + (naturalezaImpacto * 20);
        } else {
            responsabilidadScore = libertadActuar + (naturalezaImpacto * 25);
        }
        
        // Calcular total
        const total = Math.round(knowHowScore + problemasScore + responsabilidadScore);
        
        // Mostrar resultados
        knowHowResult.textContent = Math.round(knowHowScore);
        problemasResult.textContent = Math.round(problemasScore);
        responsabilidadResult.textContent = Math.round(responsabilidadScore);
        puntajeTotal.textContent = total;
        
        // Determinar niveles
        knowHowNivel.textContent = obtenerNivelKnowHow(knowHowScore);
        problemasNivel.textContent = obtenerNivelProblemas(problemasScore);
        responsabilidadNivel.textContent = obtenerNivelResponsabilidad(responsabilidadScore);
        
        // Determinar nivel HAY y perfil sugerido
        const nivel = nivelesHAY.find(n => total >= n.min && total <= n.max);
        if (nivel) {
            nivelHay.textContent = nivel.nivel;
            perfilSugerido.textContent = nivel.descripcion;
        } else {
            nivelHay.textContent = "No determinado";
            perfilSugerido.textContent = "Complete la evaluación para ver el perfil sugerido";
        }
    }
    
    function obtenerNivelKnowHow(puntaje) {
        if (puntaje <= 50) return "Básico";
        if (puntaje <= 100) return "Introductorio";
        if (puntaje <= 200) return "Intermedio";
        if (puntaje <= 350) return "Avanzado";
        if (puntaje <= 528) return "Experto";
        return "Referente";
    }
    
    function obtenerNivelProblemas(puntaje) {
        if (puntaje <= 25) return "Repetitivo";
        if (puntaje <= 50) return "Rutinario";
        if (puntaje <= 100) return "Variable";
        if (puntaje <= 200) return "Adaptativo";
        return "Estratégico";
    }
    
    function obtenerNivelResponsabilidad(puntaje) {
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