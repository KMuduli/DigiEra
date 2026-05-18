const handleImageUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  try {

    setSubmitting(true);

    // Generate unique file name
    const fileExt = file.name.split('.').pop();

    const fileName = `${Date.now()}.${fileExt}`;

    // Upload image to Supabase
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public image URL
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    // Save image URL into form state
    setFormData(prev => ({
      ...prev,
      featuredImage: data.publicUrl
    }));

  } catch (err) {

    console.error('Upload Error:', err);

    alert('Image upload failed');

  } finally {

    setSubmitting(false);

  }
};