
function entradaViewModel() {
    
    var self = this;
    
    self.entradas = ko.observableArray();

    self.entradaInputName = ko.observable();
    self.entradaInputVencimento = ko.observable();
    self.entradaInputValor = ko.observable();
    self.somarValor = ko.observable(0);
    self.totalEntradas = ko.observable(0);


    self.selectedEntradas = ko.observableArray();
    self.isUpdate = ko.observable(false);
    self.updateId = ko.observable();

    self.canEdit = ko.computed(function(){
        return self.selectedEntradas().length > 0;
    });

    self.addEntrada = function() {

        var nome = $('.nome').val();
        var vencimento = $('.vencimento').val();
        var valor = $('.valor').val();

        self.entradas.push({
            nome: nome,
            vencimento: vencimento,
            valor: valor
        });
        $.ajax({
            url: "http://localhost:3000/financeiro",
            data: JSON.stringify({
                "nome": nome,
                "vencimento": vencimento,
                "valor": valor

            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                console.log('Goal Added...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };
    self.updateEntrada = function(){
        var id = self.updateId;
        var nome = $('.nome').val();
        var vencimento = $('.vencimento').val();
        var valor = $('.valor').val();

        self.entradas.remove(function(item){
            return item._id == id
        });
        self.entradas.push({
            nome: nome,
            vencimento: vencimento,
            valor: valor
        });
        
        $.ajax({
            url: "http://localhost:3000/financeiro/"+id,
            data: JSON.stringify({
                "nome": nome,
                "vencimento": vencimento,
                "valor": valor
            }),
            type: "PUT",
            contentType: "application/json",
            success: function(data){
                console.log('despesa Updated...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };

    self.editSelected = function(){
        self.updateId = self.selectedEntradas()[0]._id;
        var nome = self.selectedEntradas()[0].nome;
        var vencimento = self.selectedEntradas()[0].vencimento;
        var valor = self.selectedEntradas()[0].valor;

        self.isUpdate(true);
        self.entradaInputName(nome);
        self.entradaInputVencimento(Vencimento);
        self.entradaInputValor(valor);
    }

    self.deleteSelected = function(){
        $.each(self.selectedEntradas(), function(index, value){
            var id = self.selectedEntradas()[index]._id;

            $.ajax({
                url: "http://localhost:3000/financeiro/"+id,
                type: "DELETE",
                async: true,
                timeout: 30000,
                success: function(data){
                    console.log('Goal Removed...')
                },
                error: function(xhr, status, err){
                    console.log(err);
                }
            })
        })
        self.entradas.removeAll(self.selectedDEntradas());
        self.selectedEntradas.removeAll();
    }

    self.getEntradas = ko.computed(function() {
        $.get('http://localhost:3000/financeiro', function(data){
        
            entradaViewModel.entradas(data);
            self.entradas().forEach(element => {

                self.somarValor(self.somarValor() + Number(element.valor || 0));
            });
        });
    });   
};

var entradaViewModel = new entradaViewModel();

ko.applyBindings(entradaViewModel);