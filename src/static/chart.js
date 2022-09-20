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
                tension: 0.1,
                datalabels: {
                    color: '#ff555f',
                    align: 'right',
                    font: {
                        weight: 'bold',
                        style: 'italic',
                        size: 14,
                    },
                    display: function(context) { 
                        return (context.dataIndex === context.dataset.data.length - 1)
                    },
                    formatter: function(value) {
                        return percentFormatter.format(value.y / 100);
                    }
                }
            },
            {
                type: 'line',
                data: data['Nvidia'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'Nvidia',
                showLine: true,
                borderColor: '#2ccdcd',
                backgroundColor: '#2ccdcd',
                borderWidth: 4,
                pointRadius: 0,
                tension: 0.1,
                datalabels: {
                    color: '#2ccdcd',
                    align: 'right',
                    font: {
                        weight: 'bold',
                        style: 'italic',
                        size: 14,
                    },
                    display: function(context) { 
                        return (context.dataIndex === context.dataset.data.length - 1)
                    },
                    formatter: function(value) {
                        return percentFormatter.format(value.y / 100);
                    }
                }
            },
            {
                type: 'line',
                data: data['scatter'].map(d => ({'x': new Date(d.postdate), 'y': d.price_to_msrp})),
                label: 'Posts',
                showLine: false,
                pointBackgroundColor: 'rgb(215, 215, 215, 0.5)',
                pointBorderColor: 'rgb(215, 215, 215, 0.5)',
                pointBorderWidth: 1,
                pointRadius: 2,
                tension: 0.1,
                datalabels: {
                    display: false,
                }
            }
        ]},
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                        color: "rgb(219, 219, 219, 0.4)",
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
                        color: '#dbdbdb',
                        drawTicks: true,
                        font: {
                            size: 16,
                        },
                        padding: 2,
                    }
                },
                y: {
                    ticks: {
                        color: '#dbdbdb',
                        font: {
                            size: 16,
                        },
                        padding: 10,
                    },
                    grid: {
                        color: "rgb(219, 219, 219, 0.4)",
                        drawBorder: false,
                        drawTicks: false,
                        lineWidth: 0.8
                    }
                }
            },
            layout: {
                padding: {
                    top: 0,
                    right: 42,
                    left: 10,
                },
                autoPadding: false,
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
                        color: '#dbdbdb',
                        padding: 10,
                        textAlign: 'right',
                        font: {
                            size: 16,
                        },
                    }
                },
                title: {
                    display: true,
                    color: '#dbdbdb',
                    text: 'Price-to-MSRP Trend',
                    align: 'start',
                    font: {
                        size: 16,
                    },
                    padding: {
                        top: 5,
                        bottom: 0
                    }
                },
                subtitle: {
                    display: true,
                    color: '#dbdbdb',
                    align: 'start',
                    text: 'Average price as a % of MSRP across all GPU models for the past 24 months',
                    font: {
                        size: 16,
                    }
                },
                tooltip: {
                    enable: false,
                    filter: function (tooltipItem, data) {
                        return tooltipItem.label === 'Posts';
                    }
                },
                horizontalRule: {
                    lineColor: '#dbdbdb',
                    yPosition: 0,
                    borderDash: [10, 10]
                },
            }
        },
        plugins: [horizontalRule, ChartDataLabels]
    })
}


function drawPriceChart(data, company, backgroundColor, canvas_id) {
    const ctx = document.getElementById(canvas_id).getContext('2d');
    const trendChart = new Chart(ctx, {
       
        data: {
            labels: data[company].map(d => d.model),
            datasets: [
                {
                    type: 'line',
                    label: 'Current',
                    data: data[company].map(d => d.now),
                    showLine: false,
                    borderColor: '#2ccdcd',
                    backgroundColor: '#2ccdcd',
                    pointRadius: 6,
                    pointStyle: 'rectRot',
                    datalabels: {
                        display: true,
                        color: '#2ccdcd',
                        font: {
                            size: 12,                            
                            weight: 'bold',
                        },
                        align: 'left',
                        formatter: function(value, context) {
                            let dataset = data[company][context.dataIndex];
                            return percentFormatter.format((dataset['now'] - dataset['mo3_ago']) / dataset['mo3_ago']);
                        }
                    },
                },
                {
                    type: 'line',
                    label: '3 Months Ago',
                    data: data[company].map(d => d.mo3_ago),
                    showLine: false,
                    borderColor: '#ff555f',
                    backgroundColor: '#ff555f',
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    datalabels: {
                        display: false,
                    },
                },
                {
                    type: 'bar',
                    label: 'gap',
                    data: data[company].map(d => [d.now, d.mo3_ago]),
                    backgroundColor: 'ghostwhite',
                    barThickness: 'flex',
                    barPercentage: 0.5,
                    datalabels: {
                        display: false,
                    },
                },
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    grid: {
                        color: "rgb(219, 219, 219, 0.4)",
                        drawOnChartArea: true,
                        drawBorder: false,
                        lineWidth: 0.5,
                    },
                    ticks: {
                        color: '#dbdbdb',
                        drawTicks: true,
                        font: {
                            size: 12,
                        },
                        padding: 2,
                        callback: (value, index, values) => {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                notation: 'compact',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 1,
                            }).format(value);
                        },
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    ticks: {
                        color: '#dbdbdb',
                        font: {
                            size: 12,
                        },
                        padding: 2,
                    },
                    grid: {
                        color: 'rgb(219, 219, 219, 0.4)',
                        drawOnChartArea: false,
                        drawBorder: false,
                        lineWidth: 0.8
                    }
                }
            },
            layout: {
                padding: 4,
                autoPadding: false,
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#dbdbdb',
                        filter: function(item, data) {
                            return item.text != 'gap';
                        },
                        usePointStyle: true,
                        boxWidth: 20,
                        boxHeight: 8,
                        font: {
                            size: 12,
                        },
                    },
                },
                title: {
                    display: true,
                    color: '#dbdbdb',
                    text: `${company} Price Movement By Model`,
                    align: 'start',
                    font: {
                        size: 16,
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                subtitle: {
                    display: true,
                    color: '#dbdbdb',
                    align: 'start',
                    text: 'The current 30-day avg price vs. the 30-day avg price 3 months ago',
                    font: {
                        size: 12,
                    }
                },
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Chart Plugins ---------------------------------------------------- /

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
        ctx.lineWidth = 3;
        ctx.strokeStyle = options.lineColor;
        ctx.setLineDash(options.borderDash);
        ctx.strokeRect(left, y.getPixelForValue(options.yPosition), width, 0);
        ctx.restore()
    }
}