/**
 * Sample data for Golden Heavy Body paint reflectance curves
 * Extracted from the full dataset
 */
const PaintData = {
    // Array of paint objects containing spectral reflectance data and color information
    paints: [
        {
            id: "n2fey",
            color_name: "Primary Yellow",
            series: "2",
            transparency: "ST",
            discontinued: false,
            rgb_hex: "#FFE200",
            reflectance: [0.0345529728, 0.0376159586, 0.0382830724, 0.0465356447, 0.0492138639, 0.0488306321, 0.0566377379, 0.0716743991, 0.0936064124, 0.13123402, 0.237146989, 0.47293359, 0.679644704, 0.803965986, 0.839567482, 0.848093152, 0.852060139, 0.853546441, 0.85597986, 0.862426162, 0.866102695, 0.87291944, 0.880297482, 0.88425988, 0.889218509, 0.898282647, 0.900375962, 0.902338564, 0.903306425, 0.904722095, 0.907085299]
        },
        {
            id: "6k7db",
            color_name: "Primary Cyan",
            series: "2",
            transparency: "O",
            discontinued: false,
            rgb_hex: "#004C93",
            reflectance: [0.089292042, 0.11350596, 0.126993194, 0.157150805, 0.230753064, 0.285891324, 0.321542531, 0.334534854, 0.316703171, 0.274687618, 0.223546907, 0.162417799, 0.107949905, 0.0690833181, 0.0486701652, 0.0383862816, 0.0317578092, 0.0291382913, 0.0279192906, 0.0273710508, 0.0269319415, 0.026847899, 0.0271413028, 0.0274508838, 0.0276630372, 0.027935192, 0.0277181547, 0.0276291389, 0.0277233645, 0.0271394886, 0.0260324739]
        },
        {
            id: "xbzbr",
            color_name: "Pyrrole Red",
            series: "8",
            transparency: "SO",
            discontinued: false,
            rgb_hex: "#D40523",
            reflectance: [0.0239125807, 0.0236831903, 0.022530837, 0.0263812318, 0.0262073576, 0.0249991585, 0.0252077505, 0.0265130512, 0.0269369781, 0.0269103274, 0.0273518711, 0.0277339593, 0.0272462554, 0.0268629454, 0.0278222896, 0.0305904243, 0.0334574431, 0.0338342041, 0.0459635369, 0.119647652, 0.290458858, 0.51221931, 0.687141597, 0.789865434, 0.848823786, 0.878373623, 0.888286889, 0.895202458, 0.90007627, 0.904367626, 0.907936394]
        },
        {
            id: "fhpg8",
            color_name: "Phthalo Green (Blue Shade)",
            series: "4",
            transparency: "T",
            discontinued: false,
            rgb_hex: "#005C44",
            reflectance: [0.0183396768, 0.0197700728, 0.0198610611, 0.0213233475, 0.0241050161, 0.0243733916, 0.0382541791, 0.0692633092, 0.129412159, 0.201889127, 0.236921519, 0.215628549, 0.170517057, 0.128995582, 0.085829258, 0.0532013364, 0.0303299725, 0.0191817395, 0.0146549754, 0.0122923721, 0.0116252787, 0.0117831025, 0.0122581534, 0.0128449639, 0.0133701209, 0.0141753983, 0.0150580844, 0.0159670431, 0.0169815104, 0.0172453839, 0.0162719674]
        },
        {
            id: "ctqcq",
            color_name: "Quinacridone Magenta",
            series: "7",
            transparency: "T",
            discontinued: false,
            rgb_hex: "#B30048",
            reflectance: [0.0807048902, 0.10975603, 0.113975041, 0.108080342, 0.0832586661, 0.0681388676, 0.0535044521, 0.0421767496, 0.0329999402, 0.02616648, 0.0229468215, 0.0212445762, 0.0199958943, 0.0195305906, 0.0200275481, 0.0207039956, 0.0215167124, 0.0234771818, 0.0294330921, 0.0561906658, 0.138707936, 0.292207986, 0.451599926, 0.573431015, 0.655604482, 0.712331593, 0.744729817, 0.766541839, 0.779826045, 0.789265871, 0.795127511]
        },
        {
            id: "kozj3",
            color_name: "Titanium White",
            series: "1",
            transparency: "O",
            discontinued: false,
            rgb_hex: "#FCFCF9",
            reflectance: [0.411713, 0.678191, 0.862153, 0.943169, 0.963035, 0.962708, 0.964614, 0.967675, 0.969232, 0.970729, 0.972362, 0.973511, 0.975429, 0.975339, 0.976072, 0.976342, 0.974266, 0.977246, 0.976193, 0.97646, 0.976482, 0.976587, 0.976134, 0.975532, 0.976533, 0.977571, 0.977575, 0.977087, 0.975919, 0.974635, 0.975646]
        },
        {
            id: "0v4zv",
            color_name: "Carbon Black",
            series: "1",
            transparency: "O",
            discontinued: false,
            rgb_hex: "#313131",
            reflectance: [0.0316709876, 0.0316711143, 0.0311320033, 0.0314585418, 0.0300367549, 0.0300380513, 0.0302851032, 0.030265769, 0.0301485211, 0.0302956291, 0.0302129425, 0.0301176328, 0.0300050192, 0.0303106885, 0.0302878618, 0.0300994311, 0.0300006941, 0.0304094311, 0.0302226786, 0.0304515883, 0.0303354301, 0.030185394, 0.0303140562, 0.0303255022, 0.0302494392, 0.0303564426, 0.0304747038, 0.0308072567, 0.0309956912, 0.0309099462, 0.0311816186]
        }
    ],

    // Information about the paint series and their relative price points
    seriesInfo: [
        { series: "1", description: "Least expensive" },
        { series: "2", description: "Inexpensive" },
        { series: "3", description: "Moderately priced" },
        { series: "4", description: "Moderately priced" },
        { series: "5", description: "Moderately expensive" },
        { series: "6", description: "Expensive" },
        { series: "7", description: "More expensive" },
        { series: "8", description: "Very expensive" },
        { series: "9", description: "Most expensive" }
    ],

    // Transparency values explanation
    transparencyTypes: [
        { code: "T", description: "Transparent" },
        { code: "ST", description: "Semi-transparent" },
        { code: "SO", description: "Semi-opaque" },
        { code: "O", description: "Opaque" }
    ]
};

// Make the data available globally
if (typeof window !== 'undefined') {
    window.PaintData = PaintData;
}