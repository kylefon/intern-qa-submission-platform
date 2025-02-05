"use client"

import { z } from "zod";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { addTicketGroup } from "@/utils/actions";

const FormSchema = z.object({
    app_name: z.string(),
    type: z.string(),
    link: z.string(),
    description: z.string().max(255).optional(),
})

export default function AddTicketGroupButton() {    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            app_name: "",
            type: "",
            link: "",
            description: "",
        },
    });

    const { control, handleSubmit, formState } = form;
    const { errors } = formState;
    
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { appGroupData, appGroupError } = await addTicketGroup(data);

        if (appGroupError) {
            console.log("Error adding ticket group: ")
        }

        if (appGroupData) {
            console.log("Successfully added ticket group");
        }
    }
    
    return (
        <div className="space-y-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-green-500">Add Ticket Group</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Ticket Group</DialogTitle>
                        <DialogDescription>Add ticket groups for interns to submit their tickets</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <FormField 
                                control={control}
                                name="app_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter ticket group name" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select app type"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="APK">APK</SelectItem>
                                                <SelectItem value="WEB">WEB</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter link" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-2">
                                <DialogClose asChild>
                                    <Button>Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Submit</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


