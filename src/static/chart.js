function drawTrendChart(data, canvas_id) {
    const ctx = document.getElementById(canvas_id).getContext('2d');
    const trendChart = new Chart(ctx, {
        data: { datasets: [
            {
                type: 'line',
                data: data['AMD'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'AMD',
                showLine: true,
                borderColor: '#ff555f',
                backgroundColor: '#ff555f',
                borderWidth: 4,
                pointRadius: 0,
                tension: 0.1
            },
            {
                type: 'line',
                data: data['Nvidia'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'AMD',
                showLine: true,
                borderColor: '#2ccdcd',
                backgroundColor: '#2ccdcd',
                borderWidth: 4,
                pointRadius: 0,
                tension: 0.1
            },
            {
                type: 'line',
                data: data['scatter'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'Posts',
                showLine: false,
                pointBackgroundColor: 'rgb(215, 215, 215, 0.2)',
                pointBorderColor: 'rgb(215, 215, 215, 0.2)',
                pointBorderWidth: 1,
                pointRadius: 2,
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
                        color: '#eff2f5',
                        drawTicks: true,
                        font: {
                            size: 12,
                        }
                    }
                },
                y: {
                    ticks: {
                        color: '#eff2f5',
                        font: {
                            size: 12,
                        }
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
                        color: '#eff2f5',
                        padding: 24,
                        textAlign: 'right',
                        font: {
                            size: 12,
                        },
                    }
                },
                title: {
                    display: true,
                    color: '#eff2f5',
                    text: 'GPU Price to MSRP Trend',
                    align: 'start',
                    font: {
                        size: 12,
                    },
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                },
                subtitle: {
                    display: true,
                    text: 'The 30-day average price vs. MSRP trend for the past 24 months',
                    font: {
                        size: 12,
                    }
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
                    borderDash: [4, 7]
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