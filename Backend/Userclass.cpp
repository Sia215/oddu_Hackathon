// ======== USER CLASS ========
class User {
protected:
    string name;
    string email;
    string skillNeeded;

public:
    User(string name = "", string email = "", string skillNeeded = "")
        : name(name), email(email), skillNeeded(skillNeeded) {}

    virtual void display() const {
        cout << "Name: " << name << endl;
        cout << "Email: " << email << endl;
        cout << "Needs Skill: " << skillNeeded << endl;
    }

    string getName() const { return name; }
    string getEmail() const { return email; }
    string getSkillNeeded() const { return skillNeeded; }
};
