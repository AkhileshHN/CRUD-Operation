/* 
 ██████  ███████ ████████      ██████  ██████  ███    ██ ████████  █████   ██████ ████████ ███████ 
██       ██         ██        ██      ██    ██ ████   ██    ██    ██   ██ ██         ██    ██      
██   ███ █████      ██        ██      ██    ██ ██ ██  ██    ██    ███████ ██         ██    ███████ 
██    ██ ██         ██        ██      ██    ██ ██  ██ ██    ██    ██   ██ ██         ██         ██ 
 ██████  ███████    ██         ██████  ██████  ██   ████    ██    ██   ██  ██████    ██    ███████ 
 
*/
({
    getColumnDefinitions: function () {
        var columns = [
            { label: 'Id', fieldName: 'Id', type: 'Id' },
            { label: 'Name', fieldName: 'Name', type: 'text', editable: true, sortable: true },
            { label: 'Mobile', fieldName: 'Mobile__c', editable: true, type: 'Number' },
            { label: 'Email', fieldName: 'Email__c', editable: true, type: 'email' },
            { label: 'Blood Group', fieldName: 'Blood_Group__c', editable: false, type: 'text' }
        ];

        return columns;
    },
    getContacts: function (component) {
        component.set("v.dataDisplay", []);
        var data = component.get("c.getContacts");
        var datafetched = [];
        data.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                datafetched = response.getReturnValue();
                datafetched.reverse();
                component.set("v.data", datafetched);
                // console.log('datafetched:apexcall', datafetched);
                component.set("v.totalData", datafetched.length);
                this.pagination(datafetched, component);
            }
            else {
                this.showError('Failed to fetch Data');
            }
        });
        $A.enqueueAction(data);
    },
/* 
██████   █████   ██████  ██ ███    ██  █████  ████████ ██  ██████  ███    ██ 
██   ██ ██   ██ ██       ██ ████   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██████  ███████ ██   ███ ██ ██ ██  ██ ███████    ██    ██ ██    ██ ██ ██  ██ 
██      ██   ██ ██    ██ ██ ██  ██ ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
██      ██   ██  ██████  ██ ██   ████ ██   ██    ██    ██  ██████  ██   ████ 
                                                                             
*/
    pagination: function (datafetched, component, event, helper) {
        var pageSize = component.get("v.pageSize");
        var pageNumber = component.get("v.pageNumber");
        var from = (pageNumber - 1) * 10;
        var to = from + pageSize;
        // console.log('from - To:', from, to);
        component.set("v.fromData", from + 1);
        component.set("v.toData", to);
        datafetched = datafetched.slice(from, to);
        // console.log(datafetched.length, component.get("v.pageSize"));
        if (datafetched.length == to) {
            component.set("v.isLastPage", true);
            component.set("v.toData", from + datafetched.length);
        } else {
            component.set("v.isLastPage", false);
        }
        // console.log('datafetched:', datafetched);
        // console.log('paginationdata:', datafetched);
        component.set("v.dataDisplay", datafetched);
    },
/* 
███    ███  ██████  ██████   █████  ██           ██████  ██████  ███    ██ ████████ ██████   ██████  ██      
████  ████ ██    ██ ██   ██ ██   ██ ██          ██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██      
██ ████ ██ ██    ██ ██   ██ ███████ ██          ██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ ██      
██  ██  ██ ██    ██ ██   ██ ██   ██ ██          ██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██      
██      ██  ██████  ██████  ██   ██ ███████      ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████ 
*/
    closeModal: function (component) {
        // console.log('Close Modal Helper');
        var currentValue = component.get("v.displayModal");
        component.set("v.displayModal", !currentValue);
    },
    closeEditModal: function (component) {
        var currentValue = component.get("v.editModal");
        component.set("v.editModal", !currentValue);
    },
/* 
████████  ██████   █████  ███████ ████████ ███████ 
   ██    ██    ██ ██   ██ ██         ██    ██      
   ██    ██    ██ ███████ ███████    ██    ███████ 
   ██    ██    ██ ██   ██      ██    ██         ██ 
   ██     ██████  ██   ██ ███████    ██    ███████ 
*/
    showSuccess: function (message, component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: 'Success',
            message: message,
            duration: ' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
    },
    showError: function (message, component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: 'Error',
            message: message,
            duration: ' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });
        toastEvent.fire();
    },
/* 
██████   █████  ████████  █████                                            
██   ██ ██   ██    ██    ██   ██                                           
██   ██ ███████    ██    ███████                                           
██   ██ ██   ██    ██    ██   ██                                           
██████  ██   ██    ██    ██   ██                                           
                                                                           
                                                                           
██    ██  █████  ██      ██ ██████   █████  ████████ ██  ██████  ███    ██ 
██    ██ ██   ██ ██      ██ ██   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██    ██ ███████ ██      ██ ██   ██ ███████    ██    ██ ██    ██ ██ ██  ██ 
 ██  ██  ██   ██ ██      ██ ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
  ████   ██   ██ ███████ ██ ██████  ██   ██    ██    ██  ██████  ██   ████ 
                                                                           
*/
    formValidation: function (formData, component, helper) {
      /*   console.log('Data recieved for validation', formData);
        console.log('Name vALUE:', formData.Name);
        console.log(Object.prototype.hasOwnProperty.call(formData, 'Name'));
        console.log('Mobile Value:', formData.Mobile__c);
        console.log(Object.prototype.hasOwnProperty.call(formData, 'Mobile__c'));
        console.log('Email Value:', formData.Email__c);
        console.log(Object.prototype.hasOwnProperty.call(formData, 'Email__c')); */
        var message = 'Duplicate Value Found';
        var returnVal= true;
        
        if (Object.prototype.hasOwnProperty.call(formData, 'Name')) {
            if (formData.Name === null) {
                message = 'Name Cannot be Empty Enter a valid Name';
                returnVal = false;
            } else if (formData.Name.length < 3) {
                message = 'Name must be atleast 3 characters';
                returnVal = false;

            } else if (!(/^[a-zA-z ]{3,20}$/.test(formData.Name))) {
                message = 'Name Cant Contain Number and Symbols';
                returnVal = false;
            }

        } 
        if (Object.prototype.hasOwnProperty.call(formData, 'Mobile__c') && returnVal) {
            // console.log('Entererd Mobil check error if loop:');
            if (!(/^[6-9]{1}[0-9]{9}$/.test(formData.Mobile__c))) {
                message = "Please Enter 10 Digit Valid Mobile";
                returnVal = false;
            }
            // console.log(returnVal,' Return value outside mobile if');
        } 

        if (Object.prototype.hasOwnProperty.call(formData, 'Email__c') && returnVal) {

            if (!(/^[a-zA-Z0-9]{1,}[._]{0,1}[a-zA-Z0-9]{0,}[._]{0,1}[a-zA-Z0-9]{1,}[._]{0,1}[a-zA-Z0-9]{1,}[._]{0,1}[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{3,}[.]{1}[a-zA-Z]{2,3}[.]{0,1}[a-zA-Z]{0,4}$/.test(formData.Email__c))) {
                message = 'Entered Invalid Email Address Check Again'
                returnVal = false;
            }
        } 
        
        // console.log('messgage from Validation outside if', message);
        if (returnVal) {
            // console.log('Valid Data');
        } else {
            this.showError(message);
        }
        return returnVal;
    },
})