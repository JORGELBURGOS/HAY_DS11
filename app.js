// Inicialización de jsPDF
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navItems = document.querySelectorAll('.nav-menu li');
    const contentSections = document.querySelectorAll('.content-section');
    const siguienteEvaluacionBtn = document.getElementById('siguiente-evaluacion');
    const anteriorDescripcionBtn = document.getElementById('anterior-descripcion');
    const siguienteResultadosBtn = document.getElementById('siguiente-resultados');
    const anteriorEvaluacionBtn = document.getElementById('anterior-evaluacion');
    const guardarEvaluacionBtn = document.getElementById('guardar-evaluacion');
    const generarPdfBtn = document.getElementById('generar-pdf');
    const saveModal = document.getElementById('save-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const guardarPdfBtn = document.getElementById('guardar-pdf');
    const guardarLocalBtn = document.getElementById('guardar-local');
    const cancelarGuardarBtn = document.getElementById('cancelar-guardar');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const listaEvaluaciones = document.getElementById('lista-evaluaciones');

    // Sliders de evaluación
    const knowHowSlider = document.getElementById('know-how-slider');
    const problemasSlider = document.getElementById('problemas-slider');
    const responsabilidadSlider = document.getElementById('responsabilidad-slider');
    const knowHowValue = document.getElementById('know-how-value');
    const problemasValue = document.getElementById('problemas-value');
    const responsabilidadValue = document.getElementById('responsabilidad-value');
    const knowHowDescription = document.getElementById('know-how-description');
    const problemasDescription = document.getElementById('problemas-description');
    const responsabilidadDescription = document.getElementById('responsabilidad-description');

    // Resultados
    const puntajeTotal = document.getElementById('puntaje-total');
    const nivelHay = document.getElementById('nivel-hay');
    const knowHowResult = document.getElementById('know-how-result');
    const problemasResult = document.getElementById('problemas-result');
    const responsabilidadResult = document.getElementById('responsabilidad-result');
    const perfilSugerido = document.getElementById('perfil-sugerido');

    // Descripciones de niveles
    const knowHowDescriptions = {
        1: "<strong>Nivel 1:</strong> Conocimientos básicos elementales.",
        2: "<strong>Nivel 2:</strong> Conocimientos operativos básicos.",
        3: "<strong>Nivel 3:</strong> Conocimientos técnicos o administrativos.",
        4: "<strong>Nivel 4:</strong> Conocimiento profesional especializado en un área.",
        5: "<strong>Nivel 5:</strong> Conocimiento profesional en múltiples áreas.",
        6: "<strong>Nivel 6:</strong> Conocimiento experto en un campo especializado.",
        7: "<strong>Nivel 7:</strong> Conocimiento experto en múltiples campos.",
        8: "<strong>Nivel 8:</strong> Conocimiento estratégico y de liderazgo."
    };

    const problemasDescriptions = {
        1: "<strong>Nivel 1:</strong> Problemas rutinarios con soluciones definidas.",
        2: "<strong>Nivel 2:</strong> Problemas que requieren interpretación de instrucciones.",
        3: "<strong>Nivel 3:</strong> Problemas que requieren selección entre alternativas.",
        4: "<strong>Nivel 4:</strong> Problemas que requieren análisis e interpretación de datos.",
        5: "<strong>Nivel 5:</strong> Problemas complejos que requieren evaluación de múltiples factores.",
        6: "<strong>Nivel 6:</strong> Problemas que requieren pensamiento estratégico.",
        7: "<strong>Nivel 7:</strong> Problemas altamente complejos con impacto organizacional.",
        8: "<strong>Nivel 8:</strong> Problemas estratégicos con impacto a largo plazo."
    };

    const responsabilidadDescriptions = {
        1: "<strong>Nivel 1:</strong> Responsabilidad por tareas específicas bajo supervisión.",
        2: "<strong>Nivel 2:</strong> Responsabilidad por resultados de tareas individuales.",
        3: "<strong>Nivel 3:</strong> Responsabilidad por resultados de un proceso o función.",
        4: "<strong>Nivel 4:</strong> Responsabilidad por resultados de un departamento o área.",
        5: "<strong>Nivel 5:</strong> Responsabilidad por resultados de múltiples áreas.",
        6: "<strong>Nivel 6:</strong> Responsabilidad por resultados organizacionales significativos.",
        7: "<strong>Nivel 7:</strong> Responsabilidad por toda la organización.",
        8: "<strong>Nivel 8:</strong> Responsabilidad estratégica y de liderazgo máximo."
    };

    const perfilesSugeridos = {
        "8-12": "Perfil operativo o técnico con responsabilidad limitada.",
        "13-17": "Profesional especializado con responsabilidad sobre procesos específicos.",
        "18-21": "Mando medio con responsabilidad sobre áreas o departamentos.",
        "22-25": "Alta dirección con responsabilidad estratégica y organizacional."
    };

    const nivelesHAY = {
        "8-12": "Nivel Básico",
        "13-17": "Nivel Medio",
        "18-21": "Nivel Alto",
        "22-25": "Nivel Ejecutivo"
    };

    // Navegación
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            if (sectionId === 'evaluaciones-guardadas') {
                cargarEvaluacionesGuardadas();
            }
        });
    });

    // Botones de navegación
    siguienteEvaluacionBtn.addEventListener('click', function() {
        if (validarDescripcionPuesto()) {
            showSection('evaluacion-hay');
        }
    });

    anteriorDescripcionBtn.addEventListener('click', function() {
        showSection('descripcion-puesto');
    });

    siguienteResultadosBtn.addEventListener('click', function() {
        calcularResultados();
        showSection('resultados');
    });

    anteriorEvaluacionBtn.addEventListener('click', function() {
        showSection('evaluacion-hay');
    });

    // Sliders
    knowHowSlider.addEventListener('input', function() {
        knowHowValue.textContent = this.value;
        knowHowDescription.innerHTML = knowHowDescriptions[this.value];
    });

    problemasSlider.addEventListener('input', function() {
        problemasValue.textContent = this.value;
        problemasDescription.innerHTML = problemasDescriptions[this.value];
    });

    responsabilidadSlider.addEventListener('input', function() {
        responsabilidadValue.textContent = this.value;
        responsabilidadDescription.innerHTML = responsabilidadDescriptions[this.value];
    });

    // Guardar y generar PDF
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
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
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
        const knowHow = parseInt(knowHowSlider.value);
        const problemas = parseInt(problemasSlider.value);
        const responsabilidad = parseInt(responsabilidadSlider.value);
        const total = knowHow + problemas + responsabilidad;
        
        knowHowResult.textContent = knowHow;
        problemasResult.textContent = problemas;
        responsabilidadResult.textContent = responsabilidad;
        puntajeTotal.textContent = total;
        
        let nivel = '';
        let perfil = '';
        
        if (total >= 8 && total <= 12) {
            nivel = nivelesHAY["8-12"];
            perfil = perfilesSugeridos["8-12"];
        } else if (total >= 13 && total <= 17) {
            nivel = nivelesHAY["13-17"];
            perfil = perfilesSugeridos["13-17"];
        } else if (total >= 18 && total <= 21) {
            nivel = nivelesHAY["18-21"];
            perfil = perfilesSugeridos["18-21"];
        } else if (total >= 22 && total <= 25) {
            nivel = nivelesHAY["22-25"];
            perfil = perfilesSugeridos["22-25"];
        }
        
        nivelHay.textContent = nivel;
        perfilSugerido.textContent = perfil;
    }

    function generarPDF() {
        const nombrePuesto = document.getElementById('nombre-puesto').value;
        const areaDepartamento = document.getElementById('area-departamento').value;
        const descripcionGeneral = document.getElementById('descripcion-general').value;
        const responsabilidades = document.getElementById('responsabilidades').value.split('\n').filter(item => item.trim() !== '');
        const fechaFormateada = new Date().toLocaleDateString('es-ES');
        
        const knowHow = knowHowResult.textContent;
        const problemas = problemasResult.textContent;
        const responsabilidad = responsabilidadResult.textContent;
        const total = puntajeTotal.textContent;
        const nivel = nivelHay.textContent;
        const perfil = perfilSugerido.textContent;
        
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
        doc.text(`Fecha de Evaluación: ${fechaFormateada}`, 105, 75, { align: 'center' });
        
        // Resultados
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('Resultados de la Evaluación', 20, 30);
        
        doc.autoTable({
            startY: 40,
            head: [['Factor', 'Puntaje']],
            body: [
                ['Know-How', knowHow],
                ['Resolución de Problemas', problemas],
                ['Responsabilidad', responsabilidad],
                ['TOTAL', { content: total, styles: { fontStyle: 'bold' } }]
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
        
        doc.setFontSize(14);
        doc.text(`Nivel HAY: ${nivel}`, 20, doc.autoTable.previous.finalY + 20);
        doc.text(`Perfil Sugerido: ${perfil}`, 20, doc.autoTable.previous.finalY + 30);
        
        // Descripción
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
            doc.setFontSize(12);
            doc.text('• ' + responsabilidad.trim(), 25, yPos, { maxWidth: 160 });
            yPos += 7;
        });
        
        doc.save(`Evaluacion_HAY_${nombrePuesto.replace(/ /g, '_')}.pdf`);
        mostrarNotificacion('PDF generado con éxito', 'success');
    }

    function guardarEnLocalStorage() {
        const evaluacion = {
            id: Date.now(),
            nombrePuesto: document.getElementById('nombre-puesto').value,
            areaDepartamento: document.getElementById('area-departamento').value,
            descripcionGeneral: document.getElementById('descripcion-general').value,
            responsabilidades: document.getElementById('responsabilidades').value,
            knowHow: knowHowResult.textContent,
            problemas: problemasResult.textContent,
            responsabilidad: responsabilidadResult.textContent,
            total: puntajeTotal.textContent,
            nivel: nivelHay.textContent,
            perfil: perfilSugerido.textContent,
            fechaGuardado: new Date().toISOString()
        };
        
        let evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
        evaluaciones.push(evaluacion);
        localStorage.setItem('evaluacionesHAY', JSON.stringify(evaluaciones));
        mostrarNotificacion('Evaluación guardada localmente', 'success');
    }

    function cargarEvaluacionesGuardadas() {
        const evaluaciones = JSON.parse(localStorage.getItem('evaluacionesHAY')) || [];
        
        if (evaluaciones.length === 0) {
            listaEvaluaciones.innerHTML = '<p class="no-evaluations">No hay evaluaciones guardadas.</p>';
            return;
        }
        
        listaEvaluaciones.innerHTML = '';
        
        evaluaciones.sort((a, b) => new Date(b.fechaGuardado) - new Date(a.fechaGuardado)).forEach(evaluacion => {
            const fechaGuardado = new Date(evaluacion.fechaGuardado).toLocaleString('es-ES');
            
            const evaluacionElement = document.createElement('div');
            evaluacionElement.className = 'evaluation-item';
            evaluacionElement.innerHTML = `
                <div class="evaluation-info">
                    <h3>${evaluacion.nombrePuesto}</h3>
                    <p>${evaluacion.areaDepartamento} | Puntaje: ${evaluacion.total} (${evaluacion.nivel})</p>
                    <p><small>Guardado el ${fechaGuardado}</small></p>
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
            document.getElementById('nombre-puesto').value = evaluacion.nombrePuesto;
            document.getElementById('area-departamento').value = evaluacion.areaDepartamento;
            document.getElementById('descripcion-general').value = evaluacion.descripcionGeneral;
            document.getElementById('responsabilidades').value = evaluacion.responsabilidades;
            
            knowHowSlider.value = evaluacion.knowHow;
            problemasSlider.value = evaluacion.problemas;
            responsabilidadSlider.value = evaluacion.responsabilidad;
            
            knowHowValue.textContent = evaluacion.knowHow;
            problemasValue.textContent = evaluacion.problemas;
            responsabilidadValue.textContent = evaluacion.responsabilidad;
            knowHowDescription.innerHTML = knowHowDescriptions[evaluacion.knowHow];
            problemasDescription.innerHTML = problemasDescriptions[evaluacion.problemas];
            responsabilidadDescription.innerHTML = responsabilidadDescriptions[evaluacion.responsabilidad];
            
            calcularResultados();
            showSection('resultados');
            mostrarNotificacion(`Evaluación de "${evaluacion.nombrePuesto}" cargada`, 'success');
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
    knowHowValue.textContent = knowHowSlider.value;
    problemasValue.textContent = problemasSlider.value;
    responsabilidadValue.textContent = responsabilidadSlider.value;
    knowHowDescription.innerHTML = knowHowDescriptions[knowHowSlider.value];
    problemasDescription.innerHTML = problemasDescriptions[problemasSlider.value];
    responsabilidadDescription.innerHTML = responsabilidadDescriptions[responsabilidadSlider.value];
});