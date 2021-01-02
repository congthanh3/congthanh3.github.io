var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function(todo, data, $) {
    
    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            todoOwner : "task-owner",
            todoNote: "task-note",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        
        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];
                            // Removing old element
                            removeElement(object);
                            // Changing object code
                            object.code = index;
                            // Generating new element
                            generateElement(object);
                            // Updating Local Storage
                            data[id] = object;
                            localStorage.setItem("todoData", JSON.stringify(data));
                            // Hiding Delete Area
                            $("#" + defaults.deleteDiv).hide();
                    }
            });
        });

        // Adding drop function to delete div
        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                // Removing old element
                removeElement(object);

                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));

                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })

    };

    // Add Task
    var generateElement = function(params){
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.todoTask,
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);


        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);
        
        $("<div />", {
            "class" : defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoDate,
            "text": params.date
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoOwner,
            "text": params.owner
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoNote,
            "text": params.note
        }).appendTo(wrapper);

        //hide and show when click on header
        $("." + defaults.todoHeader).click(function(){			
            $(this).siblings().toggle();	
        });
        //start popup
        $("." + defaults.todoTask).mouseenter(function(){
            var popHeader = $(this).children("."+defaults.todoHeader).text();
            var popDescription = $(this).children("."+defaults.todoDescription).text();
            var popDate=$(this).children("."+defaults.todoDate).text();
            var popOwner=$(this).children("."+defaults.todoOwner).text();
            var popNote=$(this).children("."+defaults.todoNote).text();
                $(".popheader").text("Task: " + popHeader);
                $(".popdescription").text("Description: "+ popDescription);
                $(".popdate").text("Date: " + popDate);
                $(".popowner").text("Owner: " +popOwner);
                $(".popnote").text("Note: " + popNote);
                $(".popup").show(300);

        // $("." + defaults.todoTask).mouseenter(function(){
        //     var popupinfor = $(this).html();
        //     $(".popup").text("infor : " + popupinfor);
        //     $(".popup").show(300);

        });
		$("." + defaults.todoTask).mouseleave(function(){
			$(".popup").hide(0);
        });
        //end popup
	    wrapper.draggable({
            // add code to implement drag and drop 
          
        });

    };

    // Remove task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, owner, tempData;

        if (inputs.length !== 6) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
        owner = inputs[3].value;
        note = inputs[4].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
            owner: owner,
            note: note
        };

        // Saving element in local storage
        data[id] = tempData;
        //add code to save data in local storage here
      

        // Generate Todo Element
        generateElement(tempData);

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
        inputs[4].value = "";
    };

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
    };

})(todo, data, jQuery);