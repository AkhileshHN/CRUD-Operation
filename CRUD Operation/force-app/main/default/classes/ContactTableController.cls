public with sharing class ContactTableController {
    @AuraEnabled
    public static List<MyContact__c> getContacts(){
        try {
            return [SELECT
            Id,
            Name,
            Mobile__c,
            Email__c,
            Blood_Group__c,
            LastModifiedDate
        FROM
            MyContact__c
            WITH SECURITY_ENFORCED
        ORDER BY
            LastModifiedDate ASC
       ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<MyContact__c> updateContacts(List<MyContact__c> contact){
        try {
            update contact;
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<MyContact__c> deleteContact(List<MyContact__c> contact){
        try {
            delete contact;
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}