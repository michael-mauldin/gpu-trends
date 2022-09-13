function drawTrendChart(data, canvas_id) {
    const ctx = document.getElementById(canvas_id).getContext('2d');
    const trendChart = new Chart(ctx, {
        data: { datasets: [
            {
                type: 'line',
                data: data['AMD'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'AMD',
                showLine: true,
                borderColor: 'red',
                borderWidth: 4,
                tension: 0.1
            },
            {
                type: 'line',
                data: data['Nvidia'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'AMD',
                showLine: true,
                borderColor: 'green',
                borderWidth: 4,
                tension: 0.1
            },
            {
                type: 'line',
                data: data['scatter'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'Posts',
                showLine: false,
                borderColor: 'red',
                pointRadius: 2,
                pointBorderWidth: 1,
                tension: 0.1
            }
        ]},
        options: {
            maintainAspectRatio: true,
            animation: false,
            tooltips: {
                enabled: false,
            },
            hover: {
                mode: null
            },
            scales: {
                x: {
                    grid: {
                        color: "#406086",
                        drawOnChartArea: false,
                        drawBorder: false,
                        lineWidth: 0.5,
                    },
                    type: 'time',
                    time: {
                        unit: 'quarter',
                        tooltipFormat: 'MMM yy',
                        displayFormats: {'quarter': 'MMM yy'}
                    },
                    ticks: {
                        color: '#406086',
                        drawTicks: true
                    }
                },
                y: {
                    ticks: {
                        color: '#406086'
                    },
                    grid: {
                        color: '#406086',
                        drawBorder: false,
                        lineWidth: 0.8
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 20,
                        boxHeight: 4,
                        color: '#FFFFFF',
                        padding: 24,
                        textAlign: 'right'
                    }
                },
                title: {
                    display: true,
                    text: 'GPU Price to MSRP Trend',
                    align: 'start',
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                },
                subtitle: {
                    display: true,
                    text: 'The 30-day average price vs. MSRP trend for the past 24 months'
                },
                tooltip: {
                    enable: false,
                    filter: function (tooltipItem, data) {
                        return tooltipItem.label === 'Posts';
                    }
                },
                horizontalRule: {
                    lineColor: '#e6eaef',
                    yPosition: 0,
                    borderDash: [5, 5]
                }
            }
        },
        plugins: [horizontalRule]
    })
}

// horizontalRule Plugin
const horizontalRule = {
    id: 'horizontalRule',
    beforeDatasetsDraw(chart, args, options) {
        const {
            ctx,
            chartArea: {top, right, bottom, left, width, height},
            scales: {x, y}
        } = chart;
        ctx.save();

        // draw line
        ctx.strokeStyle = options.lineColor;
        ctx.setLineDash(options.borderDash);
        ctx.strokeRect(left, y.getPixelForValue(options.yPosition), width, 0);
        ctx.restore()
    }
}

function drawPriceChart(data, company, canvas_id) {
    const ctx = document.getElementById(canvas_id).getContext('2d');
    const trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data[company].map(d => d.model),
            datasets: [
                {
                    label: 'Current',
                    data: data[company].map(d => [d.now, d.mo3_ago]),
                    backgroundColor: 'blue',
                }
            ]
        },
        options: {
            indexAxis: 'y'
        }
    });
}