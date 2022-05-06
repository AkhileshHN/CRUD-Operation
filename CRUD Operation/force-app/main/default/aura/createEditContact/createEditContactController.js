({
    init: function (component, event, helper) {
        component.set('v.columns', helper.getColumnDefinitions());
        helper.getContacts(component,helper);
    },
/* 
██████   █████   ██████  ██ ███    ██  █████  ████████ ██  ██████  ███    ██ 
██   ██ ██   ██ ██       ██ ████   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██████  ███████ ██   ███ ██ ██ ██  ██ ███████    ██    ██ ██    ██ ██ ██  ██ 
██      ██   ██ ██    ██ ██ ██  ██ ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
██      ██   ██  ██████  ██ ██   ████ ██   ██    ██    ██  ██████  ██   ████ 
*/
    /* Pagination Controller */
    handleNext : function(component, event, helper) { 
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber+1);
        helper.pagination((component.get("v.data")),component);
    },
     
    handlePrev : function(component, event, helper) {        
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber-1);
        helper.pagination((component.get("v.data")),component);
    },
    
/*
██████   █████  ████████  █████      ████████  █████  ██████  ██      ███████ 
██   ██ ██   ██    ██    ██   ██        ██    ██   ██ ██   ██ ██      ██      
██   ██ ███████    ██    ███████        ██    ███████ ██████  ██      █████   
██   ██ ██   ██    ██    ██   ██        ██    ██   ██ ██   ██ ██      ██      
██████  ██   ██    ██    ██   ██        ██    ██   ██ ██████  ███████ ███████ 

*/

        /* Data Table Inline Editing Controlleres */
    handleSaveEdition: function (component, event, helper) {
        var draftValues = event.getParam('draftValues');
        var validation=false;
        for (var index = 0; index < draftValues.length; index++) {
            var element = draftValues[index];
            var eachValidation= helper.formValidation(element);
            if(eachValidation=== false){
                validation=false;
                break;
            } else {validation=true}
        }
        
        // console.log(eachValidation);

        if(validation){
            var action = component.get("c.updateContacts");
        action.setParams({ "contact": draftValues });
        action.setCallback(this, function (response) {
            var state = response.getState();
            // console.log('state:', state);
            if (component.isValid() && state === "SUCCESS") {
                // console.log('Successfully RecordsUpdated', draftValues);
                event.setParams('draftValues', []);
                helper.getContacts(component,helper);
                helper.showSuccess('Records Updated Succesfully');
                $A.get('e.force:refreshView').fire();
            }else if(state === "ERROR"){
                response.getError();
            }
        });
        $A.enqueueAction(action);
        
    } else{
        // console.log('elseblock:');
    }
    },
    /* Data Table Controlleres */
    handleDelete: function (component, event, helper) {
        var selectedRows = component.get("v.selectedRows");
        // console.log('selectedRows:', selectedRows);
        var action = component.get("c.deleteContact");
        action.setParams({ "contact": selectedRows });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                // console.log('Records Deleted:');
                component.set("v.selectedRows", {});
                helper.getContacts(component,helper);
                $A.get('e.force:refreshView').fire();
            }
            else if(response.getState() === "ERROR") {
                var error = response.getError();
                helper.showError(error);
                // console.log('error:', error);
            }
        });
        $A.enqueueAction(action);
    },
    handleCancel : function (component, event, helper) {
        component.set("v.selectedRows", {});

    },
    updateSelectedRow: function (component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        var count = selectedRows.length;
        component.set("v.selectedRows", selectedRows);
        if(count===1){
            component.set("v.editButton", true);
            component.set("v.editRecordId", selectedRows[0].Id);
            component.set("v.deleteButton",true);
        } else if(count>1){
            component.set("v.deleteButton",true);
            component.set("v.editButton", false);
        }
        else{
            component.set("v.deleteButton",false);
            component.set("v.editButton", false);
        }

    },
    /* 
 ██████ ██████  ███████  █████  ████████ ███████     ███████  ██████  ██████  ███    ███ 
██      ██   ██ ██      ██   ██    ██    ██          ██      ██    ██ ██   ██ ████  ████ 
██      ██████  █████   ███████    ██    █████       █████   ██    ██ ██████  ██ ████ ██ 
██      ██   ██ ██      ██   ██    ██    ██          ██      ██    ██ ██   ██ ██  ██  ██ 
 ██████ ██   ██ ███████ ██   ██    ██    ███████     ██       ██████  ██   ██ ██      ██     
 
    */
    /* Create Contact Form Controller */
    handleSubmit : function (component, event, helper) {
        event.preventDefault();
/*         console.log('Inside Submit'); */
        var formData=event.getParam("fields");
        var validation = helper.formValidation(formData,component, helper);
        // console.log('called Validation');
        if(validation){
            // console.log('Validation passed');
            component.find('myRecordForm').submit(formData);
        }else{
            // console.log('elselock:');

        }
    },
    handleSuccess: function (component, event, helper) {
        // console.log('inside Handel Success:');
        helper.getContacts(component,helper);
        helper.closeModal(component,helper);
        helper.showSuccess('Data Saved Succesfully');

    },
    closeModal: function (component, event, helper) {
        helper.closeModal(component);
    },

    /* 
███████ ██████  ██ ████████     ███████  ██████  ██████  ███    ███ 
██      ██   ██ ██    ██        ██      ██    ██ ██   ██ ████  ████ 
█████   ██   ██ ██    ██        █████   ██    ██ ██████  ██ ████ ██ 
██      ██   ██ ██    ██        ██      ██    ██ ██   ██ ██  ██  ██ 
███████ ██████  ██    ██        ██       ██████  ██   ██ ██      ██ 


                                                                    
    */
    /* Edit Contact form Controllers */
    
    handleEditSubmit : function (component, event, helper) {
        event.preventDefault();
/*         console.log('Inside Submit'); */
        var formData=event.getParam("fields");
        var validation = helper.formValidation(formData,component, helper);
        // console.log('called edit dubmit Validation');
        if(validation){
            // console.log('Validation passed');
            component.find('myEditRecordForm').submit(formData);
        }else{
            // console.log('elselock:');

        }
    },
    handleEditSuccess: function (component, event, helper) {
        helper.getContacts(component,helper);
        helper.closeEditModal(component,helper);
        helper.showSuccess('Data Saved Succesfully');

    },
    closeEditModal : function(component, event, helper) {
        // console.log('Called close Modal');
        helper.closeEditModal(component);
    },
    handleEditModal : function (component, event, helper) {
        var toggle=component.get("v.editModal");
        component.set("v.editModal",!toggle);
    },
    /* For General Use */
    handleError: function (cmp, event, helper) {
        cmp.find('notifLib').showToast({
            "title": "Something has gone wrong!",
            "message": event.getParam("message"),
            "variant": "error"
        });
    },
})