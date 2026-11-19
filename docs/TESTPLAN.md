# Test Plan: Student Account Management System

This plan covers the business logic of the COBOL application. It will be reviewed with business stakeholders and later used to build unit and integration tests for the Node.js version.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View the starting balance | Application started | 1. Choose option 1 | Balance shown is 1000.00 | | | |
| TC-02 | Credit a valid amount | Balance is 1000.00 | 1. Choose option 2 2. Enter 250.00 | Balance becomes 1250.00 and is shown | | | |
| TC-03 | Credit then view the balance | Balance is 1000.00 | 1. Choose option 2 2. Enter 100.00 3. Choose option 1 | Balance shown is 1100.00 | | | |
| TC-04 | Debit a valid amount | Balance is 1000.00 | 1. Choose option 3 2. Enter 400.00 | Balance becomes 600.00 and is shown | | | |
| TC-05 | Debit the full balance | Balance is 1000.00 | 1. Choose option 3 2. Enter 1000.00 | Balance becomes 0.00 | | | |
| TC-06 | Debit more than the balance | Balance is 1000.00 | 1. Choose option 3 2. Enter 1500.00 | Message "Insufficient funds for this debit." and balance stays 1000.00 | | | |
| TC-07 | Credit a zero amount | Balance is 1000.00 | 1. Choose option 2 2. Enter 0.00 | Balance stays 1000.00 | | | |
| TC-08 | Several operations in a row | Balance is 1000.00 | 1. Credit 200.00 2. Debit 50.00 3. View balance | Balance shown is 1150.00 | | | |
| TC-09 | Invalid menu choice | Application started | 1. Enter 5 | Message "Invalid choice, please select 1-4." and the menu is shown again | | | |
| TC-10 | Exit the application | Application started | 1. Choose option 4 | Message "Exiting the program. Goodbye!" and the program ends | | | |
