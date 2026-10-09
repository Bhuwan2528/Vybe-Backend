import { Injectable } from "@nestjs/common";
import Groq from "groq-sdk";

@Injectable()

export class GroqProvider{
  public readonly ai: Groq;

  constructor() {
    this.ai = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  
}