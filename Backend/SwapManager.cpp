// ======== SWAP MANAGER CLASS ========
class SwapManager {
    vector<SwapRequest> requests;

public:
    void addRequest(const SwapRequest& request) {
        requests.push_back(request);
    }

    vector<SwapRequest>& getRequests() { return requests; }

    void displayAllRequests() const {
        for (const auto& req : requests) {
            req.display();
            cout << "------------------" << endl;
        }
    }
};

// ======== HELPER FUNCTIONS ========
bool validateEmail(const string& email) {
    const regex pattern("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    return regex_match(email, pattern);
}

int getValidatedRating() {
    int rating;
    while (true) {
        cin >> rating;
        if (cin.fail() || rating < 1 || rating > 5) {
            cout << "Invalid input. Enter a rating between 1 and 5: ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        } else {
            cin.ignore();
            return rating;
        }
    }
}

string getValidatedEmail() {
    string email;
    while (true) {
        getline(cin, email);
        if (validateEmail(email)) return email;
        cout << "Invalid email format. Enter again: ";
    }
}

Skill getUserInput() {
    string name, email, skillNeed, skillOffer;
    int rating;

    cout << "Name: "; getline(cin, name);
    cout << "Email: "; email = getValidatedEmail();
    cout << "Skill Needed: "; getline(cin, skillNeed);
    cout << "Skill Offered: "; getline(cin, skillOffer);
    cout << "Rating (1-5): "; rating = getValidatedRating();

    return Skill(name, email, skillNeed, skillOffer, rating);
}

