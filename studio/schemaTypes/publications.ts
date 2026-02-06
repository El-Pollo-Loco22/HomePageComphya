import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'publications',
  title: 'Publications',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'link',
      title: 'Link (URL)',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: Rule => Rule.required()
    }),
  ],
})