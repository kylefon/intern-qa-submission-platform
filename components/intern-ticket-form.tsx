"use client"
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
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
import { addTicketToServer, editTicketCard } from "@/utils/actions";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ["images/jpeg", "image/jpg", "image/png", "image/webp"];
const formSchema = z.object({
    ticketTitle: z.string().min(2).max(30),
    fixType: z.enum(["bug", "enhancement", "correction"]),
    description: z.string().min(2).max(300),
    screenshot: z
                .any()
                .refine((file) => {
                    if (!file || typeof file === 'string') return true;
                    return file?.size <= MAX_FILE_SIZE;
                }, 'Max image size is 5MB.')
                .refine(
                    (file) => {
                        if (!file || typeof file === 'string') return true;
                        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
                    },
                    "Only .jpg, .jpeg, .png and .webp formats are supported."
                ),
});

export function InternTicketForm({ appName, appVersion, initialData }) {

    console.log("INITIAL DATA ", initialData)
    const isEditing = !!initialData;

    const [selectedImage, setSelectedImage] = useState(null);
    // ticketName, fixType, description, screenshot, status (always NEW), app_id, app_version_id
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ticketTitle: initialData?.ticket_title ?? "",
            fixType: initialData?.type_of_fix ?? "",
            description: initialData?.description ?? "",
            screenshot: initialData?.screenshot ?? undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("ON SUBMIT VALUES ", values);
        setIsSubmitting(true);
        if (isEditing) {
            try {
                const updatedValues = {
                    ticketTitle: values.ticketTitle,
                    fixType: values.fixType,
                    description: values.description,
                    screenshot: selectedImage || values.screenshot,
                };
                
                const { appTicketData, appTicketError } = await editTicketCard(updatedValues, initialData.id);
                if (appTicketError) {
                    console.log("Error adding ticket group: ")
                }
                if (appTicketData) {
                    console.log("Successfully edited ticket group");
                }
            } catch (error) {
                console.error("Editing Failed! ", error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            try {
                const formData = new FormData();
                formData.append("ticket_name", values.ticketTitle);
                formData.append("type_of_fix", values.fixType);
                formData.append("description", values.description);
                formData.append("screenshot", values.screenshot);
                await addTicketToServer(formData, appName, appVersion);
            } catch (error) {
                console.error("Submitting failed!", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ isImageRemoved, setIsImageRemoved ] = useState(false);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                { initialData ? (
                    <Button onClick={() => setIsDialogOpen(true)}>Edit</Button>
                ) : ( 
                    <Button onClick={() => setIsDialogOpen(true)}>Submit a ticket</Button>
                )}
            </DialogTrigger>
            <DialogContent className="overflow-y-scroll max-h-screen">
                <DialogHeader>
                    {initialData ? (
                        <>
                            <DialogTitle>Submit a Ticket</DialogTitle>
                            <DialogDescription>Submit your ticket by filling out the forms.</DialogDescription>
                        </>
                    ): (
                        <>
                            <DialogTitle>Submit a Ticket</DialogTitle>
                            <DialogDescription>Submit your ticket by filling out the forms.</DialogDescription>
                        </>
                    )}
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
                                        {!isImageRemoved && (selectedImage || initialData?.screenshot) && (
                                            <div className="space-y-3">
                                                <img 
                                                    alt="not found"
                                                    width={"250px"}
                                                    src={selectedImage ? URL.createObjectURL(selectedImage) : initialData.screenshot}
                                                    />
                                            <Button type="button" onClick={() => {
                                                setSelectedImage(null);
                                                setIsImageRemoved(true);
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
                                                        setIsImageRemoved(false);
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
                            <Button type="button" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 
                                (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin" />
                                        Submitting...
                                    </div>
                                ) : 
                                (
                                    <div>
                                        Submit
                                    </div>
                                )
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}