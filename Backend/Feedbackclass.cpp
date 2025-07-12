// ======== FEEDBACK CLASS ========
class Feedback {
    string comment;
    int rating;

public:
    Feedback(const string& comment = "", int rating = 0)
        : comment(comment), rating(rating) {}

    void display() const {
        cout << "Feedback: " << comment << " (Rating: " << rating << "/5)" << endl;
    }

    int getRating() const { return rating; }
    string getComment() const { return comment; }
};
