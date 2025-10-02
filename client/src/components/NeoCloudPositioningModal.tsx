import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface NeoCloudPositioningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = {
  [key: string]: {
    answer: string;
    notes: string;
  };
};

export default function NeoCloudPositioningModal({
  open,
  onOpenChange,
}: NeoCloudPositioningModalProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [showEmailCompose, setShowEmailCompose] = useState(false);

  const playbooks = [
    {
      id: "playbook1",
      title: "Playbook 1: AI Cloud & Infrastructure",
      theme: "Delivering scalable, future-proof AI infrastructure.",
      questions: [
        {
          id: "p1q1",
          text: "How important is it for you that your AI platform is validated at production scale to minimise risk?",
          options: [
            "Critically Important - It's a non-negotiable requirement.",
            "Very Important - It's a key factor in our decision-making.",
            "Moderately Important - It's a nice-to-have but not a deal-breaker.",
            "Not Important - We have other methods for risk mitigation.",
          ],
        },
        {
          id: "p1q2",
          text: "Would consolidating all AI workloads (training, fine-tuning, inference, and model serving) onto a single platform simplify operations?",
          options: [
            "Yes, significantly. It would streamline our entire MLOps lifecycle.",
            "Yes, moderately. It would reduce complexity in some key areas.",
            "Unsure. We need more information to assess the impact.",
            "No. We prefer a multi-platform or best-of-breed approach.",
          ],
        },
        {
          id: "p1q3",
          text: "Do you see value in working with a provider who also runs the same infrastructure commercially, ensuring reliability and best practice?",
          options: [
            "High Value - Their real-world experience is a major advantage.",
            "Moderate Value - It provides some confidence in the solution's stability.",
            "Low Value - It's not a significant factor in our evaluation.",
            "No Value - We are not concerned with the provider's own use of the infrastructure.",
          ],
        },
        {
          id: "p1q4",
          text: "How critical is it for your AI infrastructure to be powered entirely by renewable energy?",
          options: [
            "Mandatory Requirement - It is essential for our corporate sustainability goals (CSG).",
            "High Priority - It's a strong preference and a key selection criterion.",
            "Nice-to-Have - We consider it a bonus but not a primary driver.",
            "Not a Priority - This is not a factor in our current infrastructure decisions.",
          ],
        },
        {
          id: "p1q5",
          text: "Is data sovereignty and residence a mandatory requirement for your AI initiatives?",
          options: [
            "Yes - It's a strict, non-negotiable legal and compliance requirement.",
            "Yes - It's a strong preference to maintain control and reduce latency.",
            "It Depends - It's required for specific projects or data types, but not all.",
            "No - It is not a current requirement for our operations.",
          ],
        },
      ],
    },
    {
      id: "playbook2",
      title: "Playbook 2: Deployment Speed & Modularity",
      theme: "Accelerating time-to-value while maintaining flexibility.",
      questions: [
        {
          id: "p2q1",
          text: "Would reducing deployment timelines by up to half transform your project delivery roadmap?",
          options: [
            "Yes, it would be transformative for our business strategy.",
            "Yes, it would provide a significant competitive advantage.",
            "It would be beneficial but not fundamentally change our roadmap.",
            "The impact on our overall timeline would be minimal.",
          ],
        },
        {
          id: "p2q2",
          text: "How valuable would it be to have a single partner accountable for the entire build and integration process?",
          options: [
            "Extremely Valuable - A single point of accountability is a top priority to reduce risk.",
            "Very Valuable - It would significantly simplify project management and vendor relations.",
            "Moderately Valuable - It's helpful but we are comfortable managing multiple vendors.",
            "Not a Priority - We prefer to manage integration partners ourselves.",
          ],
        },
        {
          id: "p2q3",
          text: "Do you need modular, scalable building blocks that allow seamless expansion from tens of MW to 100MW+?",
          options: [
            "Yes - This level of scalability is critical for our long-term growth strategy.",
            "Yes - Modular expansion is important for future-proofing our investment.",
            "We have moderate scalability needs, but not to that extent.",
            "No - Our current scale is sufficient for the foreseeable future.",
          ],
        },
        {
          id: "p2q4",
          text: "How quickly are you looking for a Return on Investment (ROI)?",
          options: [
            "Within 6-12 months",
            "Within 1-2 years",
            "Within 3-5 years",
            "ROI timeline is not our primary driver; performance is key.",
          ],
        },
        {
          id: "p2q5",
          text: "How much impact would minimising on-site labor, logistics risks, and commissioning complexity have on your operations?",
          options: [
            "Major Impact - It would solve significant operational headaches and reduce project risk.",
            "Significant Impact - It would lead to considerable cost and time savings.",
            "Moderate Impact - It would be a welcome improvement but not a game-changer.",
            "Minor Impact - These are not major pain points for us.",
          ],
        },
      ],
    },
    {
      id: "playbook3",
      title: "Playbook 3: Observability & Lifecycle",
      theme: "Managing operations with full transparency and resilience.",
      questions: [
        {
          id: "p3q1",
          text: "Would enterprise-grade observability and telemetry simplify operations and troubleshooting in complex AI environments?",
          options: [
            "Yes, drastically. It's essential for managing our complex environment.",
            "Yes, it would provide significant simplification and reduce our mean time to resolution (MTTR).",
            "It would offer some benefits but is not a critical need.",
            "No, our current monitoring tools are sufficient.",
          ],
        },
        {
          id: "p3q2",
          text: "How useful would predictive maintenance and automated lifecycle management be to minimise downtime?",
          options: [
            "Extremely Useful - Maximising uptime is our top operational priority.",
            "Very Useful - It would be a major contributor to service reliability and efficiency.",
            "Moderately Useful - It's a beneficial feature but not a core requirement.",
            "Not a Priority - We have an established process for maintenance and lifecycle management.",
          ],
        },
        {
          id: "p3q3",
          text: "Do you require real-time chargeback, usage metering, and transparent cost reporting for internal and external stakeholders?",
          options: [
            "Yes - This is a mandatory requirement for financial governance and client billing.",
            "Yes - It's a high priority for departmental cost allocation and budget tracking.",
            "It would be nice to have for better visibility, but we have workarounds.",
            "No - This level of financial reporting is not currently needed.",
          ],
        },
        {
          id: "p3q4",
          text: "Would offering white-label AI cloud services under your own brand give you a competitive advantage in your market?",
          options: [
            "Yes - It would create a significant new revenue stream and strategic advantage.",
            "Yes - It would provide a moderate advantage and enhance our brand.",
            "Potentially - It's an interesting option we would consider for the future.",
            "No - This is not relevant to our current business model.",
          ],
        },
      ],
    },
  ];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer,
        notes: prev[questionId]?.notes || "",
      },
    }));
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: prev[questionId]?.answer || "",
        notes,
      },
    }));
  };

  const generateEmailBody = () => {
    let body = "Neo Cloud Positioning - Survey Responses\n\n";
    
    if (organizationName) {
      body += `Organisation Name: ${organizationName}\n`;
    }
    if (contactName) {
      body += `Contact Name: ${contactName}\n`;
    }
    if (organizationName || contactName) {
      body += "\n";
    }
    
    playbooks.forEach((playbook) => {
      body += `\n${"=".repeat(60)}\n`;
      body += `${playbook.title}\n`;
      body += `Theme: ${playbook.theme}\n`;
      body += `${"=".repeat(60)}\n\n`;
      
      playbook.questions.forEach((question, index) => {
        const response = formData[question.id];
        body += `${index + 1}. ${question.text}\n`;
        body += `   Answer: ${response?.answer || "Not answered"}\n`;
        if (response?.notes) {
          body += `   Notes: ${response.notes}\n`;
        }
        body += "\n";
      });
    });
    
    return body;
  };

  const handleSubmit = () => {
    const body = generateEmailBody();
    setEmailBody(body);
    setShowEmailCompose(true);
  };

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent("Neo Cloud Positioning - Survey Responses");
    const body = encodeURIComponent(emailBody);
    window.location.href = `mailto:john.mariani@nokia.com?subject=${subject}&body=${body}`;
    
    // Reset form and close
    setFormData({});
    setOrganizationName("");
    setContactName("");
    setEmailBody("");
    setShowEmailCompose(false);
    onOpenChange(false);
  };

  if (showEmailCompose) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Review and Send</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <Label>To: john.mariani@nokia.com</Label>
              </div>
              <div>
                <Label>Subject: Neo Cloud Positioning - Survey Responses</Label>
              </div>
              <div className="space-y-2">
                <Label>Message Body:</Label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  data-testid="textarea-email-body"
                />
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEmailCompose(false)}
              data-testid="button-back"
            >
              Back to Form
            </Button>
            <Button
              onClick={handleEmailSubmit}
              data-testid="button-send-email"
            >
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Neo Cloud Positioning</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="organization-name">Organisation Name</Label>
            <Input
              id="organization-name"
              placeholder="Enter organisation name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              data-testid="input-organization-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Name</Label>
            <Input
              id="contact-name"
              placeholder="Enter contact name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              data-testid="input-contact-name"
            />
          </div>
        </div>
        
        <Tabs defaultValue="playbook1" className="w-full">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-playbooks">
            <TabsTrigger value="playbook1" data-testid="tab-playbook1">Playbook 1</TabsTrigger>
            <TabsTrigger value="playbook2" data-testid="tab-playbook2">Playbook 2</TabsTrigger>
            <TabsTrigger value="playbook3" data-testid="tab-playbook3">Playbook 3</TabsTrigger>
          </TabsList>

          {playbooks.map((playbook) => (
            <TabsContent key={playbook.id} value={playbook.id} className="mt-6">
              <ScrollArea className="h-[55vh] pr-4">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{playbook.title}</h3>
                    <p className="text-sm text-muted-foreground">{playbook.theme}</p>
                  </div>

                  {playbook.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3 pb-6 border-b" data-testid={`question-${question.id}`}>
                      <p className="font-medium">
                        {index + 1}. {question.text}
                      </p>
                      
                      <RadioGroup
                        value={formData[question.id]?.answer || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                        data-testid={`radio-group-${question.id}`}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-start space-x-2">
                            <RadioGroupItem
                              value={option}
                              id={`${question.id}-${optionIndex}`}
                              data-testid={`radio-${question.id}-${optionIndex}`}
                            />
                            <Label
                              htmlFor={`${question.id}-${optionIndex}`}
                              className="font-normal cursor-pointer leading-relaxed"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor={`notes-${question.id}`}>Notes (optional):</Label>
                        <Textarea
                          id={`notes-${question.id}`}
                          placeholder="Add any additional notes or context..."
                          value={formData[question.id]?.notes || ""}
                          onChange={(e) => handleNotesChange(question.id, e.target.value)}
                          className="min-h-[80px]"
                          data-testid={`textarea-notes-${question.id}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-testid="button-submit"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
