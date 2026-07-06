// ================================
// CARREGAR DADOS
// ================================

fetch("dados/dados.json")
    .then(response => response.json())
    .then(dados => {

        // ----------------------------
        // KPIs
        // ----------------------------

        const totalVendas = dados.length;

        const faturamento = dados.reduce((total, venda) => {
            return total + Number(venda.SalesPriceSanitized);
        }, 0);

        const ticketMedio = faturamento / totalVendas;

        const cidades = [...new Set(dados.map(v => v.CitySanitized))];

        document.getElementById("totalVendas").innerHTML = totalVendas;

        document.getElementById("faturamento").innerHTML =
            faturamento.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        document.getElementById("ticketMedio").innerHTML =
            ticketMedio.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        document.getElementById("cidades").innerHTML = cidades.length;

        gerarGraficoCidade(dados);

        gerarGraficoModelo(dados);

        gerarGraficoTempo(dados);

        gerarGraficoPagamento(dados);

    });


// ==========================================
// FATURAMENTO POR CIDADE
// ==========================================

function gerarGraficoCidade(dados){

    const cidades={};

    dados.forEach(venda=>{

        const cidade=venda.CitySanitized;

        const valor=Number(venda.SalesPriceSanitized);

        cidades[cidade]=(cidades[cidade]||0)+valor;

    });

    new Chart(document.getElementById("cidadeChart"),{

        type:"bar",

        data:{

            labels:Object.keys(cidades),

            datasets:[{

                label:"Faturamento",

                data:Object.values(cidades),

                backgroundColor:"#D5001C"

            }]

        }

    });

}



// ==========================================
// MODELOS MAIS VENDIDOS
// ==========================================

function gerarGraficoModelo(dados){

    const modelos={};

    dados.forEach(venda=>{

        const modelo=venda.PorscheModelSanitized;

        modelos[modelo]=(modelos[modelo]||0)+1;

    });

    new Chart(document.getElementById("modeloChart"),{

        type:"bar",

        data:{

            labels:Object.keys(modelos),

            datasets:[{

                label:"Quantidade",

                data:Object.values(modelos),

                backgroundColor:"#777"

            }]

        },

        options:{

            indexAxis:"y"

        }

    });

}



// ==========================================
// EVOLUÇÃO DAS VENDAS
// ==========================================

function gerarGraficoTempo(dados){

    const meses={};

    dados.forEach(venda=>{

        const data=venda.SaleDateSanitized;

        if(data==="INVALID") return;

        const mes=data.substring(0,7);

        meses[mes]=(meses[mes]||0)+1;

    });

    new Chart(document.getElementById("tempoChart"),{

        type:"line",

        data:{

            labels:Object.keys(meses),

            datasets:[{

                label:"Vendas",

                data:Object.values(meses),

                borderColor:"#D5001C",

                fill:false,

                tension:.3

            }]

        }

    });

}



// ==========================================
// FORMA DE PAGAMENTO
// ==========================================

function gerarGraficoPagamento(dados){

    const pagamentos={};

    dados.forEach(venda=>{

        const pagamento=venda.PayMethodSanitized;

        pagamentos[pagamento]=(pagamentos[pagamento]||0)+1;

    });

    new Chart(document.getElementById("pagamentoChart"),{

        type:"doughnut",

        data:{

            labels:Object.keys(pagamentos),

            datasets:[{

                data:Object.values(pagamentos),

                backgroundColor:[

                    "#D5001C",

                    "#444",

                    "#999",

                    "#cccccc"

                ]

            }]

        }

    });

}
