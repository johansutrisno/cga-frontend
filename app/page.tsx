'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/components/layout/app-layout"
import axios from 'axios'

interface Caption {
  text: string;
  hashtags: string[];
}

export default function Home() {
  const [formData, setFormData] = useState({
    keywords: '',
    languageStyle: '',
    brandTone: '',
    captionLength: '',
    targetAudience: '',
    hashtags: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [generatedCaption, setGeneratedCaption] = useState<Caption[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const processCaptions = (rawText: string): Caption[] => {
    const lines = rawText.split('\n');
    return lines.map(line => {
      const match = line.match(/\d+\.\s"(.+)"\s(.+)/);
      if (match) {
        return {
          text: match[1],
          hashtags: match[2].split(' ')
        };
      }
      return { text: line, hashtags: [] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const prompt = `Give me a list of creative captions for instagram with the writing style ${formData.languageStyle}, brand tone ${formData.brandTone}, target audience ${formData.targetAudience}, and hashtags ${formData.hashtags}. The desired caption length is ${formData.captionLength}, with the main theme being ${formData.keywords}.`

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
        const rawCaptions = response.data.candidates[0].content.parts[0].text;
        const processedCaptions = processCaptions(rawCaptions);
        setGeneratedCaption(processedCaptions);
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
    <AppLayout>
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
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
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
            {generatedCaption.length > 0 ? (
              <div>
                {generatedCaption.map((caption, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-100 rounded">
                    <p className="text-lg mb-2">{caption.text}</p>
                    <div className="flex flex-wrap">
                      {caption.hashtags.map((hashtag, hashIndex) => (
                        <span key={hashIndex} className="mr-2 mb-2 px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Your generated caption will appear here.</p>
            )}
          </div>

          {image && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Uploaded Image</h3>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded image"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
