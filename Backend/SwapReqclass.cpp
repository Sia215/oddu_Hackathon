// ======== SWAP REQUEST CLASS ========
class SwapRequest {
private:
    static int idCounter;
    int requestId;
    Skill requester;
    Skill receiver;
    string status;
    Feedback feedback;

public:
    SwapRequest(Skill requester, Skill receiver)
        : requester(requester), receiver(receiver), status("Pending") {
        requestId = ++idCounter;
    }

    void accept() { status = "Accepted"; }
    void reject() { status = "Rejected"; }
    void addFeedback(const Feedback& fb) { feedback = fb; }

    void display() const {
        cout << "\n=== Swap Request ID: " << requestId << " ===" << endl;
        cout << "\n--- Requester ---" << endl;
        requester.display();
        cout << "\n--- Receiver ---" << endl;
        receiver.display();
        cout << "\nStatus: " << status << endl;
        if (status == "Accepted" && feedback.getRating() > 0)
            feedback.display();
    }
};
int SwapRequest::idCounter = 0;
