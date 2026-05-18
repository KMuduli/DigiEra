import { supabase } from '../lib/supabase';

export async function uploadImage(file) {

    try {

        const fileExt = file.name.split('.').pop();

        const fileName = `${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file);

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);

        return data.publicUrl;

    } catch (error) {

        console.error('Upload Error:', error);

        throw error;
    }
}