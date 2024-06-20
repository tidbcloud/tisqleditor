import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useSchemaContext } from '@/contexts/schema-context'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function SchemasTree() {
  const { loadSchema, schema, setSchema } = useSchemaContext()

  const { data: schemaData } = useQuery({
    queryKey: ['db_schema'],
    queryFn: loadSchema
  })
  useEffect(() => {
    setSchema(schemaData ?? null)
  }, [schemaData])

  return (
    <Accordion type="multiple" className="w-full">
      {schema?.map((s) => (
        <AccordionItem value={s.name} key={s.name}>
          <AccordionTrigger>{s.name}</AccordionTrigger>
          <AccordionContent>aaa</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// export function AccordionDemo() {
//   return (
//     <Accordion type="multiple" collapsible className="w-full">
//       <AccordionItem value="item-1">
//         <AccordionTrigger>Is it accessible?</AccordionTrigger>
//         <AccordionContent>
//           {/* Yes. It adheres to the WAI-ARIA design pattern. */}

//           <Accordion type="multiple" collapsible className="w-full">
//             <AccordionItem value="item-5">
//               <AccordionTrigger>Is it styled?</AccordionTrigger>
//               <AccordionContent>
//                 Yes. It comes with default styles that matches the other
//                 components&apos; aesthetic.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-6">
//               <AccordionTrigger>Is it animated?</AccordionTrigger>
//               <AccordionContent>
//                 Yes. It's animated by default, but you can disable it if you
//                 prefer.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </AccordionContent>
//       </AccordionItem>

//       <AccordionItem value="item-2">
//         <AccordionTrigger>Is it styled?</AccordionTrigger>
//         <AccordionContent>
//           Yes. It comes with default styles that matches the other
//           components&apos; aesthetic.
//         </AccordionContent>
//       </AccordionItem>
//       <AccordionItem value="item-3">
//         <AccordionTrigger>Is it animated?</AccordionTrigger>
//         <AccordionContent>
//           Yes. It's animated by default, but you can disable it if you prefer.
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   )
// }
