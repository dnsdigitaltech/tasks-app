$(function(){

    //para editar
    let edit = false;

    console.log('Jquery is working');
    //caso não exista dados bo banco oculta tela da busca
    $('#task-result').hide();
    fetchTasks();
    $('#search').keyup(function(e){ //BUSCAR
        //verificar se o elemento é um valor string
        if($('#search').val()){
            let search = $('#search').val();
            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data: {search},
                success: function(response){
                    let tasks = JSON.parse(response);
                    let template = '';
                    tasks.forEach(task => {
                        template += `
                        <li>${task.name}</li>
                        `
                    })
                    $('#container').html(template);     
                    //existindo dados no banco mostra a tela de resultados da busca
                    $('#task-result').show();          
                }
            });
        }
    })

    $('#task-form').submit(function(e) {//CRIAR/EDITAR
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        }

        //codicional para editar
        let url = edit ===false ? 'task-add.php' : 'task-edit.php';
        
        $.post(url, postData, function(response){
            console.log(postData);
            fetchTasks();//Depois que salva dar um refresh nos dados
            //limpar o formulário depois que salvar
            $('#task-form').trigger('reset');
        });//enviando os dados salvar
        
        e.preventDefault();
    });

    function fetchTasks(){//LISTAR
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response){
                let tasks =  JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td><a href="#" class="task-item">${task.name}</a></td>
                            <td>${task.description}</td>
                            <td><button class="task-delete btn btn-danger">Delete</button></td>
                        </tr>
                    `
                });
                $('#tasks').html(template);
            }
        })
    }

    $(document).on('click', '.task-delete', function(){//DELETAR
        
        if(confirm('Deseja elimitar esta tarefa?')){
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php', {id}, function(response) {
                fetchTasks();//Depois que deleta dar um refresh nos dados
            });
        }

    });

    $(document).on('click', '.task-item', function(){//EDITAR
        
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-single.php', {id}, function(response){
            //mostrando no formulário;
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            edit = true;//para editar
        });

    });

});