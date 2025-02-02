"use client"
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ["images/jpeg", "image/jpg", "image/png", "image/webp"];
const formSchema = z.object({
    ticketTitle: z.string().min(2).max(30),
    fixType: z.enum(["bug", "enhancement", "correction"]),
    description: z.string().min(2).max(300),
    screenshot: z
                .any()
                .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
                .refine(
                    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                    "Only .jpg, .jpeg, .png and .webp formats are supported."
                ),
});

export function InternTicketForm() {
    const [selectedImage, setSelectedImage] = useState(null);
    // ticketName, fixType, description, screenshot, status (always NEW), app_id, app_version_id
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ticketTitle: "",
            description: "",
            screenshot: undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                    <Button>Submit a ticket</Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>Submit a Ticket</DialogTitle>
                    <DialogDescription>Submit your ticket by filling out the forms.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                             control={form.control}
                             name="ticketTitle"
                             render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ticket Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ticket title..." id="ticketTitle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                             )}
                        />

                        <FormField 
                             control={form.control}
                             name="fixType"
                             render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Fix</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type of fix" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="bug">Bug</SelectItem>
                                                <SelectItem value="enhancement">Enhancement</SelectItem>
                                                <SelectItem value="correction">Correction</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                             )}
                        />

                        <FormField 
                             control={form.control}
                             name="description"
                             render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter description here..." id="description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                             )}
                        />

                        <div className="space-y-3">
                            <FormField 
                                control={form.control}
                                name="screenshot"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Screenshot</FormLabel>
                                        {selectedImage && (
                                            <div className="space-y-3">
                                                <img 
                                                    alt="not found"
                                                    width={"250px"}
                                                    src={URL.createObjectURL(selectedImage)}
                                                />
                                            <Button onClick={() => {
                                                setSelectedImage(null);
                                                form.setValue("screenshot", undefined);
                                                }}>Remove Image</Button>
                                            </div>
                                        )}
                                        <FormControl>
                                            <Input
                                                id="screenshot"
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => {
                                                    const uploadedFile = event.target.files?.[0];
                                                    if (uploadedFile) {
                                                        setSelectedImage(uploadedFile);
                                                        field.onChange(uploadedFile);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end space-x-1">
                            <Button>Cancel</Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}