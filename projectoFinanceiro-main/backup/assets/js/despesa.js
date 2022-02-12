function despesaViewModel() {
    
    var self = this;
    
    self.despesas = ko.observableArray();

    self.despesaInputName = ko.observable();
    self.despesaInputVencimento = ko.observable();
    self.despesaInputValor = ko.observable();
    self.somarValorDespesas = ko.observable(0);
    self.totalDespesas = ko.observable(0);


    self.selectedDespesas = ko.observableArray();
    self.isUpdateDespesa = ko.observable(false);
    self.updateIdDespesa = ko.observable();

    self.canEditDespesa = ko.computed(function(){
        return self.selectedDespesas().length > 0;
    });

    self.addDespesa = function() {

        var nomeDespesa = $('.nomeDespesa').val();
        var vencimentoDespesa = $('.vencimentoDespesa').val();
        var valorDespesa = $('.valorDespesa').val();

        self.despesas.push({
            nomeDespesa: nomeDespesa,
            vencimentoDespesa: vencimentoDespesa,
            valorDespesa: valorDespesa
        });
        $.ajax({
            url: "http://localhost:3000/financeiro",
            data: JSON.stringify({
                "nomeDespesa": nomeDespesa,
                "vencimentoDespesa": vencimentoDespesa,
                "valorDespesa": valorDespesa

            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                console.log('Despesa Added...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };
    self.updateDespesa = function(){
        var id = self.updateId;
        var nomeDespesa = $('.nomeDespesa').val();
        var vencimentoDespesa = $('.vencimentoDespesa').val();
        var valorDespesa = $('.valorDespesa').val();

        self.despesas.remove(function(item){
            return item._id == id
        });
        self.despesas.push({
            nomeDespesa: nomeDespesa,
            vencimentoDespesa: vencimentoDespesa,
            valorDespesa: valorDespesa
        });
        
        $.ajax({
            url: "http://localhost:3000/financeiro/"+id,
            data: JSON.stringify({
                "nomeDespesa": nomeDespesa,
                "vencimentoDespesa": vencimentoDespesa,
                "valorDespesa": valorDespesa
            }),
            type: "PUT",
            contentType: "application/json",
            success: function(data){
                console.log('Despesa Updated...')
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    };

    self.editSelected = function(){
        self.updateIdDespesa = self.selectedDespesas()[0]._id;
        var nomeDespesa = self.selectedDespesas()[0].nomeDespesa;
        var vencimentoDespesa = self.selectedDespesas()[0].vencimentoDespesa;
        var valorDespesa = self.selectedDespesas()[0].valorDespesa;

        self.isUpdateDespesa(true);
        self.despesaInputName(nomeDespesa);
        self.despesaInputVencimento(vencimentoDespesa);
        self.despesaInputValor(valorDespesa);
    }

    self.deleteSelectedDespesa = function(){
        $.each(self.selectedDespesas(), function(index, value){
            var id =self.selectedDespesas()[index]._id;

            $.ajax({
                url: "http://localhost:3000/financeiro/"+id,
                type: "DELETE",
                async: true,
                timeout: 30000,
                success: function(data){
                    console.log('Despesa Removed...')
                },
                error: function(xhr, status, err){
                    console.log(err);
                }
            })
        })
        self.despesas.removeAll(self.selectedDespesas());
        self.selectedDespesas.removeAll();
    }

    self.totalDespesas = ko.computed( function() {

        var despesas = self.despesas();

        var soma = despesas.reduce((sum, valores) => {
            return Number(sum) + Number(valores.valorDespesa);
        }, 0);
        
        return soma;
    });
    
    self.getDespesas = ko.computed(function() {
        $.get('http://localhost:3000/financeiro', function(data){
        
        despesaViewModel.despesas(data);
        }); 
    });   
};

var despesaViewModel = new despesaViewModel();

ko.applyBindings(despesaViewModel);