import React, { useEffect, useState } from 'react';
import { Badge, Box, Flex, FormControl, FormLabel, HStack, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack, VStack } from '@chakra-ui/react';
import { ContactInFirebase } from '../../../models/InterfaceContactsInFirebase';
import { TbWorld } from 'react-icons/tb';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import InputAddContact from '../../inputs/InputAddContact/InputAddContact';
import ButtonInForm from '../../buttons/ButtonInForm/ButtonInForm';
import { useFormik } from "formik";
import * as yup from "yup";
import { storageImage } from '../../../firebase/config';
import { addAddressesContact, ContactAddresses, stateContactAddresses } from '../../../features/addAddressesToState/addAddressesToStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addSocialMediaUrlContact, SocialMediaUrl, stateContactSocialMedia } from '../../../features/addSocialMediaToState/addSocialmediaToStateSlice';
import { RiFacebookBoxFill, RiLinkedinBoxFill, RiGithubFill, RiYoutubeFill, RiInstagramLine } from 'react-icons/ri';
import { setLoading, setSuccess } from '../../../features/firebaseContacts/firebaseContactsSlice';

export type FormEditContactProps = {
  handleEditContact: (
    name?: string | any,
    description?: string |any,
    typeContact?: string |any,
    addresses?: ContactAddresses[] |any,
    socialMedia?: SocialMediaUrl[] |any,
    image?: { name: any, url: any,
  })  => void;
  onClose: () => void;
  onOpen?: () => void;
  contact: ContactInFirebase | any,
};

const FormEditContact: React.FC<FormEditContactProps> = ({ handleEditContact, onClose, contact }) => {

  const dispatch = useDispatch();

  const [name] = useState<string>(contact.name);
  const [email] = useState<string>(contact.addresses.email);
  const [phone] = useState<string>(contact.addresses.phone);
  const [street] = useState<string>(contact.addresses.street);
  const [code] = useState<string>(contact.addresses.code);
  const [city] = useState<string>(contact.addresses.city);
  const [country] = useState<string>(contact.addresses.country);
  const [description] = useState<string>(contact.description);
  const [typeContact, setTypeContact] = useState<string>(contact.typeContact);

  const[facebookUrl] = useState<string>(contact.socialMedia.facebook)
  const[linkedinUrl] = useState<string>(contact.socialMedia.linkedin)
  const[githubUrl] = useState<string>(contact.socialMedia.github)
  const[youtubeUrl] = useState<string>(contact.socialMedia.youtube)
  const[instagramUrl] = useState<string>(contact.socialMedia.instagram)
  const [webUrl] = useState<string>(contact.socialMedia.web)
  const [valueRadio, setValueRadio] = useState<string>("")

  //IMAGES
  const [file, setFile] = useState<File | any>([]);
  const [errorFile, setErrorFile] = useState("");
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const [url, setUrl] = useState<string>(contact.image.url)
  const [imageName, setImageName] = useState<string>(contact.image.name)

  const onFileChange = (e: any) => {
     const image = e.target.files[0];
     if (image )  {
      setFile(image);
      setErrorFile('')
    } else {
      setFile([]);
      setErrorFile('Wybierz plik .jpg lub .png');
    }
  }
  useEffect(() => {
    onHandleAdd();
  }, [file]);

  const onHandleAdd = async () => {
   const storageRef = storageImage.ref('images');
   const fileRef = storageRef.child(file.name);
   await fileRef.put(file)
   setImageName(file.name)
   setUrl(await fileRef.getDownloadURL())
 };

 let image: { name: string | any, url: string | any } = {
   name: imageName,
   url: url,
 };

  // ADDRESSES

  const initialValuesAddress  = {
    name: name,
    city: city,
    street: street,
    code: code,
    country: country,
    description: description,
    email: email,
    phone: phone,
  };

  const validationSchema = yup.object({
    name: yup.string().required("Required").min(3, "Nazwa użytkownika powinna zawierać ca najmniej 3 znaki").max(50, "Nazwa użytkownika może mieć max 50 znaków"),
    city: yup.string(),
    code: yup.string().matches(/^[0-9]{2}-[0-9]{3}$/, "Kod musi być w postaci 00-000"),
    street: yup.string(),
    country: yup.string(),
    description: yup.string(),
    email: yup.string().email("Email zawiera błędy"),
    phone: yup.string().matches(/^[0-9]{9}$/, 'Numer telefonu musi skladać sie z cyfr'),
  });

  const onSubmitAddresses = () => {
    const addresses = {
      city: formik.values.city,
      street: formik.values.street,
      code: formik.values.code,
      country: formik.values.country,
      email: formik.values.email,
      phone: formik.values.phone,
    };
    dispatch(addAddressesContact(addresses))
    setValueRadio('');
  };

  const onResetAddresses = () => {
    setValueRadio('');
  };

  const formik = useFormik({
    initialValues: initialValuesAddress,
    validationSchema,
    onSubmit: onSubmitAddresses,
    onReset: onResetAddresses,
  });

  //SOCIAL MEDIA

  const onSubmitSocialMedia = () => {
    const socialMedia = {
      facebook: formikSM.values.facebook,
      linkedin: formikSM.values.linkedin,
      instagram: formikSM.values.instagram,
      github: formikSM.values.github,
      youtube: formikSM.values.youtube,
      web: formikSM.values.web,
    }
    dispatch(addSocialMediaUrlContact(socialMedia));
    setValueRadio('');
  };

  const validationSchemaSM = yup.object({
    facebook: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),
    linkedin: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),
    instagram: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),
    github: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),
    youtube: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),
    web: yup.string().matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Błąd w adresie www"),

    });
  const initialValuesSM = {
    facebook: facebookUrl,
    linkedin: linkedinUrl,
    instagram: instagramUrl,
    github: githubUrl,
    youtube: youtubeUrl,
    web: webUrl,
  }

  const formikSM = useFormik({
    initialValues: initialValuesSM,
    validationSchema: validationSchemaSM,
    onSubmit: onSubmitSocialMedia,
  });

  const onResetSocialMedia = () => {
    setValueRadio('');
  };

  const _addresses = useSelector(stateContactAddresses);
  const _socialMedia = useSelector(stateContactSocialMedia);

  const updateContact = () => {
    handleEditContact({ name: formik.values.name, description: formik.values.description, typeContact: typeContact,  addresses: _addresses.length !==0 ? _addresses : {
      city: formik.values.city,
      street: formik.values.street,
      code: formik.values.code,
      country: formik.values.country,
      email: formik.values.email,
      phone: formik.values.phone,
    },
    socialMedia: _socialMedia.length !== 0 ? _socialMedia :
    {
      facebook: formikSM.values.facebook,
    linkedin: formikSM.values.linkedin,
    instagram: formikSM.values.instagram,
    github: formikSM.values.github,
    youtube: formikSM.values.youtube,
    web: formikSM.values.web,}, image })
    dispatch(setSuccess(true));
    dispatch(setLoading(true));
     onClose();
  };

  const closeFormEditContact = () => {
    onClose();
  };
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
      >
        <FormControl id='name'>
          <FormLabel>Imię i Nazwisko</FormLabel>
          <InputAddContact
            error={formik.errors.name}
            message={formik.errors.name}
            onChange={formik.handleChange}
            placeholder='imię i nawzwisko'
            touched={formik.touched.name}
            value={formik.values.name}
          />
        </FormControl>
        <FormControl id='description'>
          <FormLabel>Stanowisko</FormLabel>
          <InputAddContact
            error={formik.errors.description}
            message={formik.errors.description}
            onChange={formik.handleChange}
            placeholder='stanowisko'
            touched={formik.touched.description}
            value={formik.values.description}
         />
        </FormControl>
        <Box paddingBottom='20px'>
          <RadioGroup onChange={setTypeContact} value={typeContact}>
            <Stack direction='row' justifyContent='space-between'>
              <Radio value='1'>Prywatne</Radio>
              <Radio value='2'>Służbowe</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box>
        <FormControl id="file">
          <FormLabel>Zdjęcie</FormLabel>
          <input
            accept="image/png, image/jpeg"
            onChange={onFileChange}
            type="file"
            />
        </FormControl>
        </Box>
        <Box paddingBottom='20px'>
          <RadioGroup onChange={setValueRadio} value={valueRadio}>
            <Stack direction='row' justifyContent='space-between'>
              <Radio value='address'>Adres korenspondencyjny</Radio>
              <Radio value='socialMedia'>Social Media</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        {valueRadio === 'address'
          ? (
            <Flex
              flexDirection='column'
              marginBottom='20px'
            >
              <Box
                border='1px solid #edeaea'
                borderRadius='12px'
                marginBottom='20px'
                padding='10px'
              >
                <Badge
                  border='1px solid #edeaea'
                  marginTop='-45px'
                  padding='5px'
                  variant='subtle'
                >
                  Adres korenspondencyjny
                </Badge>
                <FormControl
                  id="country"
                >
                  <FormLabel>Kraj</FormLabel>
                  <InputAddContact
                    error={formik.errors.country}
                    message={formik.errors.country}
                    onChange={formik.handleChange}
                    placeholder='kraj'
                    touched={formik.touched.country}
                    value={formik.values.country}
                  />
                </FormControl>
                <FormControl
                  id="street"
                >
                  <FormLabel>Ulica</FormLabel>
                  <InputAddContact
                    error={formik.errors.street}
                    message={formik.errors.street}
                    onChange={formik.handleChange}
                    placeholder='ulica'
                    touched={formik.touched.street}
                    value={formik.values.street}
                  />
                </FormControl>
                <HStack>
                  <FormControl id="code">
                    <FormLabel>Kod</FormLabel>
                    <InputAddContact
                      error={formik.errors.code}
                      message={formik.errors.code}
                      onChange={formik.handleChange}
                      placeholder='kod'
                      touched={formik.touched.code}
                      value={formik.values.code}
                    />
                  </FormControl>
                  <FormControl
                    id="city"
                  >
                    <FormLabel>Poczta</FormLabel>
                    <InputAddContact
                      error={formik.errors.city}
                      message={formik.errors.city}
                      onChange={formik.handleChange}
                      placeholder='miasto'
                      touched={formik.touched.city}
                      value={formik.values.city}
                    />
                  </FormControl>
                </HStack>
              </Box>
              <Box
                border='1px solid #edeaea'
                borderRadius='12px'
                padding='10px'
              >
                <Badge
                  border='1px solid #edeaea'
                  marginTop='-45px'
                  padding='5px'
                  variant='subtle'
                >
                  Dane teleadresowe
                </Badge>
                <FormControl
                  id="email"
                >
                  <FormLabel>Email</FormLabel>
                  <InputAddContact
                    error={formik.errors.email}
                    message={formik.errors.email}
                    onChange={formik.handleChange}
                    placeholder='email'
                    touched={formik.touched.email}
                    value={formik.values.email}
                  />
                </FormControl>
                <FormControl
                  id="phone"
                >
                  <FormLabel>Telefon</FormLabel>
                  <InputAddContact
                    error={formik.errors.phone}
                    message={formik.errors.phone}
                    onChange={formik.handleChange}
                    placeholder='telefon'
                    touched={formik.touched.phone}
                    value={formik.values.phone}
                  />
                </FormControl>
              </Box>
              <Flex
                justifyContent='flex-end'
                paddingBottom='25px'
                paddingTop='25px'
                >
                <ButtonInForm title='Dodaj adres' onSubmit={formik.handleSubmit} variant='submit' />
                <ButtonInForm title='Anuluj' onReset={onResetAddresses} variant='reset' />
              </Flex>
            </Flex>
          )
          : (<p></p>)
        }
        {valueRadio === 'socialMedia'
          ? (
            <Box
              border='1px solid #edeaea'
              borderRadius='12px'
              marginTop='20px'
              padding='10px'
            >
              <Badge
                border='1px solid #edeaea'
                marginTop='-45px'
                padding='5px'
                variant='subtle'
              >
                Social Media
              </Badge>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <RiFacebookBoxFill
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  letterSpacing='2px'
                  lineHeight='16px'
                  marginBottom='5px'
                  marginTop='5px'
                  name='facebook'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.facebook}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                />
                 { formikSM.errors.facebook && formikSM.touched.facebook &&  <ErrorMessage message={formikSM.errors.facebook} />}
              </InputGroup>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <RiLinkedinBoxFill
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  lineHeight='16px'
                  letterSpacing='2px'
                  marginTop='5px'
                  marginBottom='5px'
                  name='linkedin'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.linkedin}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                />
                 { formikSM.errors.linkedin && formikSM.touched.linkedin &&  <ErrorMessage message={formikSM.errors.linkedin} />}
              </InputGroup>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <RiGithubFill
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  letterSpacing='2px'
                  lineHeight='16px'
                  marginBottom='5px'
                  marginTop='5px'
                  name='github'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.github}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                />
                 { formikSM.errors.github && formikSM.touched.github &&  <ErrorMessage message={formikSM.errors.github} />}
              </InputGroup>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <RiYoutubeFill
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  letterSpacing='2px'
                  lineHeight='16px'
                  marginTop='5px'
                  marginBottom='5px'
                  name='youtube'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.youtube}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                  />
                 { formikSM.errors.youtube && formikSM.touched.youtube &&  <ErrorMessage message={formikSM.errors.youtube} />}
              </InputGroup>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <RiInstagramLine
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  letterSpacing='2px'
                  lineHeight='16px'
                  marginBottom='5px'
                  marginTop='5px'
                  name='instagram'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.instagram}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                />
                 { formikSM.errors.instagram && formikSM.touched.instagram &&  <ErrorMessage message={formikSM.errors.instagram} />}
              </InputGroup>
              <InputGroup flexDirection='column'>
                <InputLeftElement
                  marginTop='5px'
                  pointerEvents='none'
                  children={
                    <TbWorld
                      color='gray.300' />
                  }
                />
                <Input
                  background='white.100'
                  borderBottomColor='orange.300'
                  borderBottomWidth='2px'
                  borderRadius='12px'
                  colorScheme='#d2d1d13e'
                  cursor='pointer'
                  fontFamily='Orbitron'
                  fontSize='12px'
                  fontWeight='normal'
                  letterSpacing='2px'
                  lineHeight='16px'
                  marginBottom='5px'
                  marginTop='5px'
                  name='web'
                  onChange={formikSM.handleChange}
                  paddingBottom='16px'
                  paddingTop='16px'
                  placeholder='https://www....'
                  type='text'
                  value={formikSM.values.web}
                  _hover={{ borderColor: 'blue.500', color: "blue.500" }}
                />
                 { formikSM.errors.web && formikSM.touched.web &&  <ErrorMessage message={formikSM.errors.web} />}
              </InputGroup>
              <Flex
                justifyContent='flex-end'
                paddingTop='15px'
              >
                <ButtonInForm title='Dodaj Social Media' onSubmit={formikSM.handleSubmit} variant='submit' />
                <ButtonInForm title='Anuluj' onReset={onResetSocialMedia} variant='reset' />
              </Flex>
            </Box>)
          : (<p></p>)
        }
        <Box>
          <Flex
            justifyContent='flex-end'
            paddingTop='15px'
            >
            <ButtonInForm title='Zapisz zmiany' onSubmit={updateContact} variant='submit' />
            <ButtonInForm title='Anuluj' onReset={closeFormEditContact} variant='reset' />
          </Flex>
        </Box>
      </form>
    </>
  )
}

export default FormEditContact;