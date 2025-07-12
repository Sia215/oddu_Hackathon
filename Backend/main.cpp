#include <iostream>
#include <string>
#include <vector>
#include <limits>
#include <regex>
using namespace std;

int main() {
    UserManager userManager;
    SwapManager swapManager;
    int userCount;

    cout << "How many users do you want to enter? ";
    cin >> userCount;
    cin.ignore();

    vector<Skill> allUsers;
    for (int i = 0; i < userCount; ++i) {
        cout << "\n===== Enter Details for User " << (i + 1) << " =====" << endl;
        Skill user = getUserInput();
        userManager.addUser(user);
        allUsers.push_back(user);
    }

    cout << "\n===== All Users =====" << endl;
    userManager.displayAllUsers();

    // Request Swap
    string reqName, recName;
    cout << "Enter name of requester: ";
    getline(cin, reqName);
    cout << "Enter name of receiver: ";
    getline(cin, recName);

    Skill* requester = userManager.findUserByName(reqName);
    Skill* receiver = userManager.findUserByName(recName);

    if (requester && receiver) {
        SwapRequest request(*requester, *receiver);
        swapManager.addRequest(request);

        cout << "\n===== All Swap Requests =====" << endl;
        swapManager.displayAllRequests();

        char choice;
        cout << "\nAccept request? (y/n): ";
        cin >> choice;
        cin.ignore();

        if (choice == 'y' || choice == 'Y') {
            swapManager.getRequests().back().accept();
            string comment;
            int fbRating;
            cout << "Leave feedback for this swap: "; getline(cin, comment);
            cout << "Feedback rating (1-5): ";
            fbRating = getValidatedRating();
            Feedback fb(comment, fbRating);
            swapManager.getRequests().back().addFeedback(fb);
        } else {
            swapManager.getRequests().back().reject();
        }

        cout << "\n===== Updated Swap Requests =====" << endl;
        swapManager.displayAllRequests();
    } else {
        cout << "Invalid requester or receiver name!\n";
    }

    return 0;
}

