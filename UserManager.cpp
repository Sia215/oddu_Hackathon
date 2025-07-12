
// ======== USER MANAGER CLASS ========
class UserManager {
    vector<Skill> users;

public:
    void addUser(const Skill& user) {
        users.push_back(user);
    }

    Skill* findUserByName(const string& name) {
        for (auto& user : users) {
            if (user.getName() == name)
                return &user;
        }
        return nullptr;
    }

    void displayAllUsers() const {
        for (const auto& user : users) {
            user.display();
            cout << "------------------" << endl;
        }
    }

    const vector<Skill>& getUsers() const { return users; }
};
