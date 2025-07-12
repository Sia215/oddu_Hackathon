// ======== SKILL CLASS (inherits User) ========
class Skill : public User {
private:
    string skillOffered;
    int rating;

public:
    Skill(string name = "", string email = "", string skillNeeded = "", string skillOffered = "", int rating = 0)
        : User(name, email, skillNeeded), skillOffered(skillOffered), rating(rating) {}

    void display() const override {
        User::display();
        cout << "Offers Skill: " << skillOffered << endl;
        cout << "Skill Rating: " << rating << "/5" << endl;
    }

    string getSkillOffered() const { return skillOffered; }
    int getRating() const { return rating; }
};
