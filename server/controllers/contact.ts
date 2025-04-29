import { Request, Response } from "express";
import { z } from "zod";
import { sendEmail } from "../services/email";

// Validation schema for contact messages
const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// In-memory storage for contact messages (for demo purposes)
// In production, this would be stored in a database
export const contactMessages: {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}[] = [];

let nextMessageId = 1;

const contactController = {
  // Handle contact form submissions
  submitContactMessage: async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = contactMessageSchema.parse(req.body);
      
      // Save the message (would be in database in production)
      const newMessage = {
        id: nextMessageId++,
        ...validatedData,
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };
      
      contactMessages.push(newMessage);
      
      // Send email notification to admin
      const emailSubject = `New Contact Message from ${validatedData.name}`;
      const emailHtml = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `;
      
      const emailText = `
        New Contact Message
        
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        ${validatedData.phone ? `Phone: ${validatedData.phone}` : ''}
        Message: ${validatedData.message}
        Sent at: ${new Date().toLocaleString()}
      `;
      
      await sendEmail({
        to: "blinkeach@gmail.com",
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      
      // Return success response
      res.json({
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon.",
      });
    } catch (error) {
      console.error("Error processing contact message:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to send your message. Please try again later.",
      });
    }
  },
  
  // Get all contact messages (admin only)
  getContactMessages: async (req: Request, res: Response) => {
    try {
      // In production, this would fetch from the database with pagination, etc.
      // For demo purposes, we'll add some sample messages if none exist
      if (contactMessages.length === 0) {
        // Seed with some sample messages
        contactMessages.push(
          {
            id: nextMessageId++,
            name: "Rahul Kumar",
            email: "rahul.kumar@example.com",
            message: "Hi there! I recently purchased a smartphone from your website but haven't received any shipping update. Order #BLK23456.",
            status: "new",
            createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          },
          {
            id: nextMessageId++,
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            phone: "+91 98765 43210",
            message: "I need help with a return for my recent purchase. The item arrived damaged. Order #BLK23457",
            status: "new",
            createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
          },
          {
            id: nextMessageId++,
            name: "Amit Patel",
            email: "amit.patel@example.com",
            phone: "+91 87654 32109",
            message: "I have a question about the warranty on your electronics products. Can you please clarify how long the warranty is valid for?",
            status: "new",
            createdAt: new Date(Date.now() - 240 * 60000).toISOString(), // 4 hours ago
          }
        );
      }
      
      // Return messages (sorted by latest first)
      res.json(
        [...contactMessages].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact messages",
      });
    }
  },
  
  // Update message status (admin only)
  updateMessageStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!id || !status || !['read', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request. ID and valid status required",
        });
      }
      
      // Find and update the message
      const messageIndex = contactMessages.findIndex(m => m.id === parseInt(id));
      
      if (messageIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }
      
      // Update status
      contactMessages[messageIndex].status = status as 'read' | 'archived';
      
      // Return success
      res.json({
        success: true,
        message: "Message status updated successfully",
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update message status",
      });
    }
  },
};

export default contactController;