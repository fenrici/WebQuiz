document.addEventListener("DOMContentLoaded", function() {
    // Obtener datos del localStorage
    const historial = JSON.parse(localStorage.getItem("historialQuizzes") || []);
    
    // Mostrar estadísticas básicas
    document.getElementById('total-attempts').textContent = historial.length;
    
    if (historial.length > 0) {
        const puntuaciones = historial.map(item => item.puntuacion);
        const mejor = Math.max(...puntuaciones);
        const promedio = (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(1);
        
        document.getElementById('best-score').textContent = mejor;
        document.getElementById('average-score').textContent = promedio;

        // Preparar datos para el gráfico de barras
        const labels = historial.map((_, index) => `Intento ${index + 1}`);
        const seriesData = [puntuaciones];
        
        // Configuración del gráfico de barras
        const data = {
            labels: labels,
            series: seriesData
        };

        const options = {
            seriesBarDistance: 15,
            axisY: {
                onlyInteger: true,
                low: 0,
                high: 10,
                ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                offset: 40,
                labelOffset: {
                    x: 0,
                    y: 3  //  bajar los números
                },
                scaleMinSpace: 20,
                showGrid: true
            },
            height: '450px',  // Más altura
            chartPadding: {
                top: 10,
                right: 20,
                bottom: 40,  // Más espacio abajo
                left: 40     // Más espacio a la izquierda
            }
        };
        const responsiveOptions = [
            ['screen and (max-width: 600px)', {
                seriesBarDistance: 10,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value.split(' ')[1]; // esto es para que muestre solo el número del intento
                    }
                }
            }]
        ];

        //  gráfico de barras
        new Chartist.Bar('#quizBarChart', data, options, responsiveOptions);
    } else {
        document.getElementById('quizBarChart').innerHTML = 
            '<p class="no-data">No hay intentos registrados aún</p>';
    }
});