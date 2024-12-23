'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from 'axios'
import CaptionList from '@/components/shared/caption-list'

export default function Home() {
  const [formData, setFormData] = useState({
    keywords: '',
    languageStyle: '',
    brandTone: '',
    captionLength: '',
    targetAudience: '',
    hashtags: '',
  })
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const prompt = `Give me a list of creative captions for Instagram with the writing style ${formData.languageStyle}, brand tone ${formData.brandTone}, target audience ${formData.targetAudience}, and hashtags ${formData.hashtags}. The desired caption length is ${formData.captionLength}, with the main theme being ${formData.keywords}. Provide the response in a JSON format with "number", "caption", and "hashtags" fields.
    
    Example format:
    \`\`\`json
    [
      {
        "number": 1,
        "caption": "Embrace the power of words. Let your pen dance across the page, weaving a tapestry of emotions and ideas.",
        "hashtags": "#WriteWithPassion #LiteraryLove #StorytellingSoul"
      },
      {
        "number": 2,
        "caption": "Lost in the labyrinth of imagination, where thoughts take flight and dreams collide.",
        "hashtags": "#WritingEscape #ThoughtfulThursday #CreativeCorner"
      },
      {
        "number": 3,
        "caption": "Words are the paintbrushes of our minds, painting vibrant pictures that ignite the imagination.",
        "hashtags": "#WordplayWednesday #ArtOfWriting #LiteraryVibes"
      },
      {
        "number": 4,
        "caption": "In the realm of literature, where characters come alive and stories unfold, we find solace and inspiration.",
        "hashtags": "#BookishDelights #ReadingEscape #MondayMotivation"
      },
      {
        "number": 5,
        "caption": "Immerse yourself in the written word. Let it transport you to distant lands, introduce you to unforgettable characters, and spark a fire within.",
        "hashtags": "#ReadingIsLife #LiteraryJourney #LostInWords"
      }
    ]
    \`\`\`
    `;

    const request = {
      "contents": [
        {
          "parts": [
            {
              "text": prompt
            }
          ]
        }
      ]
    }

    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    try {
      setIsLoading(true);
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`, request);
      console.log('Response:', response.data);
      // Handle success (e.g., show success message, clear form)
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        setGeminiResponse(response.data)
      } else {
        console.error('Error:', 'There is no captions');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Caption Generator Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="keywords">Keywords or main theme</Label>
            <Input
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="e.g., coffee, relaxation, motivation"
            />
          </div>
          <div>
            <Label htmlFor="languageStyle">Language Style</Label>
            <Select name="languageStyle" onValueChange={(value) => handleSelectChange('languageStyle', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="brandTone">Brand Tone</Label>
            <Select name="brandTone" onValueChange={(value) => handleSelectChange('brandTone', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="provocative">Provocative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="captionLength">Caption Length</Label>
            <Select name="captionLength" onValueChange={(value) => handleSelectChange('captionLength', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              placeholder="e.g., young professionals, parents, students"
            />
          </div>
          <div>
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleInputChange}
              placeholder="e.g., #coffee #relax #motivation"
            />
          </div>
          <Button type="submit" isLoading={isLoading}>Generate Caption</Button>
        </form>
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Generated Caption</h2>
        <div className="border p-4 rounded-md min-h-[200px]">
          {geminiResponse && !isLoading ? (
            <CaptionList data={geminiResponse} />
          ) : (
            <p className="text-muted-foreground">Your generated caption will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
