
function despesaViewModel() {
    
    var self = this;
    
    self.despesas = ko.observableArray();

    self.despesaInputName = ko.observable();
    self.despesaInputVencimento = ko.observable();
    self.despesaInputValor = ko.observable();
    self.somarValor = ko.observable(0);
    self.totalDespesas = ko.observable(0);


    self.selectedDespesas = ko.observableArray();
    self.isUpdate = ko.observable(false);
    self.updateId = ko.observable();

    self.canEdit = ko.computed(function(){
        return self.selectedDespesas().length > 0;
    });

    self.addDespesa = function() {

        var nome = $('.nome').val();
        var vencimento = $('.vencimento').val();
        var valor = $('.valor').val();

        self.despesas.push({
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
    self.updateDespesa = function(){
        var id = self.updateId;
        var nome = $('.nome').val();
        var vencimento = $('.vencimento').val();
        var valor = $('.valor').val();

        self.despesas.remove(function(item){
            return item._id == id
        });
        self.despesas.push({
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
        self.updateId = self.selectedDespesas()[0]._id;
        var nome = self.selectedDespesas()[0].nome;
        var vencimento = self.selectedDespesas()[0].vencimento;
        var valor = self.selectedDespesas()[0].valor;

        self.isUpdate(true);
        self.despesaInputName(nome);
        self.despesaInputVencimento(Vencimento);
        self.despesaInputValor(valor);
    }

    self.deleteSelected = function(){
        $.each(self.selectedDespesas(), function(index, value){
            var id =self.selectedDespesas()[index]._id;

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
        self.despesas.removeAll(self.selectedDespesas());
        self.selectedDespesas.removeAll();
    }

    self.getDespesas = ko.computed(function() {
        $.get('http://localhost:3000/financeiro', function(data){
        
        despesaViewModel.despesas(data);
            self.despesas().forEach(element => {

                self.somarValor(self.somarValor() + Number(element.valor || 0));
            });
        });
    });   
};

var despesaViewModel = new despesaViewModel();

ko.applyBindings(despesaViewModel);