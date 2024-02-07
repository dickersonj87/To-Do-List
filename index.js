$(document).ready(function(){
    var getAndDisplayAllTasks = function () {
        $.ajax({
          type: 'GET',
          url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1163',
          dataType: 'json',
          success: function (response, textStatus) {
            console.log('Task object:', response.tasks[0]);
            $('#todo-list').empty();
            response.tasks.forEach(function (task) {
                var status = task.completed ? 'Finished' : 'Not Finished';
                var activeTasks = JSON.parse(localStorage.getItem('activeTasks')) || [];
                var checked = task.active ? 'checked' : '';
                $('#todo-list').append('<div class="row"><p class="col-xs-8">' + task.content + '</p><p class="col-xs-2">' + status + '</p><button class="delete" data-id="' + task.id + '">Delete</button><button class="change-status" data-id="' + task.id + '">Done!</button><input type="checkbox" class="set-active" data-id="' + task.id + '" ' + checked + '></div>');
            })
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });
      }
      
      var createTask = function () {
        $.ajax({
          type: 'POST',
          url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=1163',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            task: {
              content: $('#new-task-content').val()
            }
          }),
          success: function (response, textStatus) {
            $('#new-task-content').val('');
            getAndDisplayAllTasks();
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });  
      }
      
      $('#create-task').on('submit', function (e) {
        e.preventDefault();
        createTask();
      });
      
      var deleteTask = function (id) {
        $.ajax({
       type: 'DELETE',
          url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=1163',
          success: function (response, textStatus) {
            getAndDisplayAllTasks();
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });
      }

      $(document).on('click', '.delete', function () {
        var id = $(this).data('id');
        console.log(id);
        deleteTask(id);
      });

      var changeStatus = function (id) {
        $.ajax({
          type: 'PUT',
          url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=1163',
          contentType: 'application/json',
          dataType: 'json',
          success: function (response, textStatus) {
            console.log('PUT request response:', response);
            getAndDisplayAllTasks();
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });
      }
      
      $(document).on('click', '.change-status', function () {
        var id = $(this).data('id');
        changeStatus(id);
      });

      var setActive = function (id, checked) {
        var activeTasks = JSON.parse(localStorage.getItem('activeTasks')) || [];
        if (checked) {
          activeTasks.push(id);
        } else {
          var index = activeTasks.indexOf(id);
          if (index !== -1) activeTasks.splice(index, 1);
        }
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
      }

      $(document).on('change', '.set-active', function () {
        var id = $(this).data('id');
        setActive(id, this.checked);
      });
      
      getAndDisplayAllTasks();
    });