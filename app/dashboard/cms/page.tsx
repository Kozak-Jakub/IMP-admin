"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: "draft" | "pending" | "published";
  createdAt: Date;
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [contentType, setContentType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contents, setContents] = useState<ContentItem[]>([]);

  const handleSubmit = async (isDraft: boolean) => {
    if (!contentType || !title || !description) {
      return;
    }

    const newContent: ContentItem = {
      id: Date.now().toString(),
      type: contentType,
      title,
      description,
      status: isDraft ? "draft" : "pending",
      createdAt: new Date(),
    };

    setContents([newContent, ...contents]);

    // Reset form
    setContentType("");
    setTitle("");
    setDescription("");
  };

  const handleSelectContent = (content: ContentItem) => {
    setTitle(content.title);
    setDescription(content.description);
    setContentType(content.type);
  };

  const handleDeleteContent = (id: string) => {
    setContents(contents.filter((content) => content.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Content Management
        </h2>
        <p className="text-muted-foreground">
          Create and manage multilingual content
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room">Room Description</SelectItem>
                    <SelectItem value="amenity">Amenity</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title (Primary Language)</Label>
                <Input
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description (Primary Language)</Label>
                <Textarea
                  placeholder="Enter description"
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleSubmit(true)}>
                  Save Draft
                </Button>
                <Button onClick={() => handleSubmit(false)}>
                  Submit for Translation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contents
                  .filter((content) => content.status === "pending")
                  .map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {content.type} •{" "}
                          {content.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectContent(content)}
                      >
                        Translate
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contents
                  .filter((content) => content.status === "published")
                  .map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {content.type} • Published on{" "}
                          {content.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectContent(content)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteContent(content.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
