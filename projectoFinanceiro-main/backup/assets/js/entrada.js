
function entradaViewModel() {
    
    var self = this;
    
    self.entradas = ko.observableArray();

    self.entradaInputName = ko.observable();
    self.entradaInputRecebimento = ko.observable();
    self.entradaInputValor = ko.observable();
    self.somarValorEntrada = ko.observable(0);
    self.totalEntradas = ko.observable(0);


    self.selectedEntradas = ko.observableArray();
    self.isUpdateEntrada = ko.observable(false);
    self.updateIdEntrada = ko.observable();

    self.canEditEntrada = ko.computed(function(){
        return self.selectedEntradas().length > 0;
    });

    self.addEntrada = function() {

        var nomeEntrada = $('.nomeEntrada').val();
        var recebimentoEntrada = $('.recebimentoEntrada').val();
        var valorEntrada = $('.valorEntrada').val();

        self.entradas.push({
            nomeEntrada: nomeEntrada,
            recebimentoEntrada: recebimentoEntrada,
            valorEntrada: valorEntrada
        });
        $.ajax({
            url: "http://localhost:3000/financeiro",
            data: JSON.stringify({
                "nomeEntrada": nomeEntrada,
                "recebimentoEntrada": recebimentoEntrada,
                "valorEntrada": valorEntrada

            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                console.log('Entradas Added...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };
    self.updateEntrada = function(){
        var id = self.updateId;
        var nomeEntrada = $('.nomeEntrada').val();
        var recebimentoEntrada = $('.recebimentoEntrada').val();
        var valorEntrada = $('.valorEntrada').val();

        self.entradas.remove(function(item){
            return item._id == id
        });
        self.entradas.push({
            nomeEntrada: nomeEntrada,
            recebimentoEntrada: recebimentoEntrada,
            valorEntrada: valorEntrada
        });
        
        $.ajax({
            url: "http://localhost:3000/financeiro/"+id,
            data: JSON.stringify({
                "nomeEntrada": nomeEntrada,
                "recebimentoEntrada": recebimentoEntrada,
                "valorEntrada": valorEntrada
            }),
            type: "PUT",
            contentType: "application/json",
            success: function(data){
                console.log('Entradas Updated...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };

    self.editSelected = function(){
        self.updateIdEntrada = self.selectedEntradas()[0]._id;
        var nomeEntrada = self.selectedEntradas()[0].nomeEntrada;
        var recebimentoEntrada = self.selectedEntradas()[0].recebimentoEntrada;
        var valorEntrada = self.selectedEntradas()[0].valorEntrada;

        self.isUpdateEntrada(true);
        self.entradaInputName(nomeEntrada);
        self.entradaInputRecebimento(recebimentoEntrada);
        self.entradaInputValor(valorEntrada);
    }

    self.deleteSelectedEntrada = function(){
        $.each(self.selectedEntradas(), function(index, value){
            var id = self.selectedEntradas()[index]._id;

            $.ajax({
                url: "http://localhost:3000/financeiro/"+id,
                type: "DELETE",
                async: true,
                timeout: 30000,
                success: function(data){
                    console.log('Entradas Removed...')
                },
                error: function(xhr, status, err){
                    console.log(err);
                }
            })
        })
        self.entradas.removeAll(self.selectedDEntradas());
        self.selectedEntradas.removeAll();
    }

    self.totalEntradas = ko.computed( function() {

        var entradas = self.entradas();

        var soma = entradas.reduce((sum, valores) => {
            return Number(sum) + Number(valores.valorEntrada);
        }, 0);
        
        return soma;
    });

    self.getEntradas = ko.computed(function() {
        $.get('http://localhost:3000/financeiro', function(data){
        
        entradaViewModel.entradas(data);
        });
    });   
};

var entradaViewModel = new entradaViewModel();

ko.applyBindings(entradaViewModel);