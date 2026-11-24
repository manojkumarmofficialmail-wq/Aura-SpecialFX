import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR=48000; T=15.0; N=int(SR*T); rng=np.random.default_rng(3)
t=np.arange(N)/SR
L=np.zeros(N); Rr=np.zeros(N)
def add(sig,start,pan=0.0,gain=1.0):
    i=int(start*SR); sig=sig[:max(0,N-i)]
    l=np.sqrt(.5*(1-pan)); r=np.sqrt(.5*(1+pan))
    L[i:i+len(sig)]+=sig*gain*l; Rr[i:i+len(sig)]+=sig*gain*r
def env(n,a,d): x=np.arange(n)/SR; return np.minimum(1,x/max(a,1e-4))*np.exp(-x/d)
def filt(x,kind,f): return sosfilt(butter(4,f,kind,fs=SR,output='sos'),x)
def kick(g=1):
    n=int(.45*SR);x=np.arange(n)/SR;f=45+110*np.exp(-x*28);ph=2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph)*np.exp(-x*7)+.3*filt(rng.standard_normal(n),'high',2000)*np.exp(-x*120))*g
def hat(): n=int(.06*SR);return filt(rng.standard_normal(n),'high',8000)*env(n,.001,.012)
def whoosh(dur,up=True):
    n=int(dur*SR);x=np.linspace(0,1,n);noise=rng.standard_normal(n);out=np.zeros(n);seg=n//24
    for k in range(24):
        fc=(300+6000*(k/24)**2) if up else (6300-6000*(k/24)**.5);s=slice(k*seg,(k+1)*seg)
        out[s]=sosfilt(butter(2,[fc*.7,fc*1.3],'band',fs=SR,output='sos'),noise[s])
    return out*np.sin(np.pi*x)**1.5
def riser(dur):
    n=int(dur*SR);x=np.linspace(0,1,n);f=200+1800*x**3;ph=2*np.pi*np.cumsum(f)/SR
    return (.25*np.sin(ph)+.6*whoosh(dur))*x**2
def boom():
    n=int(3*SR);x=np.arange(n)/SR;f=30+80*np.exp(-x*6);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-x*1.4)*1.2+filt(rng.standard_normal(n),'low',3000)*np.exp(-x*3)*.5+filt(rng.standard_normal(n),'high',5000)*np.exp(-x*2.2)*.25
def chime(freq,dur=1.6):
    n=int(dur*SR);x=np.arange(n)/SR
    return (np.sin(2*np.pi*freq*x)+.4*np.sin(2*np.pi*freq*2.01*x)+.15*np.sin(2*np.pi*freq*3.98*x))*env(n,.004,.45)
def crackle(dur,density=900):
    n=int(dur*SR);out=np.zeros(n);idx=rng.integers(0,n-200,int(density*dur))
    for i in idx: out[i:i+120]+=rng.standard_normal(120)*np.exp(-np.arange(120)/18)*rng.uniform(.2,1)
    return filt(out,'high',2500)
def pad(freqs,dur,cut=1200):
    n=int(dur*SR);x=np.arange(n)/SR;s=np.zeros(n)
    for f in freqs:
        for det in(-.12,0,.12): s+=((x*f*(1+det/100))%1*2-1)
    s=filt(s/len(freqs)/3,'low',cut); return s

# --- intro: shimmer + riser into 2.0s
for i,f in enumerate([1760,2217,2637,3520,2637,2217,3520,4186]): add(chime(f,1.2),.1+i*.22,pan=np.sin(i)*.6,gain=.09)
add(riser(1.9),.1,gain=.45)
# --- pad bed under everything (A minor -> A major at finale) with sidechain
padA=pad([110,164.8,220,261.6,329.6],13.0,1100); padA*=np.minimum(1,np.arange(len(padA))/SR/2.0)
padF=pad([110,138.6,164.8,220,277.2,329.6],2.2,1800); padF*=np.minimum(1,np.arange(len(padF))/SR/.05)*np.linspace(1,0,len(padF))**1.2
bed=np.zeros(N); bed[:len(padA)]+=padA*.5; i=int(13.0*SR); bed[i:i+len(padF)]+=padF[:N-i]*.7
duck=np.ones(N)
beats=[2.0+k*.5 for k in range(21)]  # 2.0 .. 12.0
for b in beats:
    j=int(b*SR);n=int(.35*SR);duck[j:j+n]=np.minimum(duck[j:j+n],1-.7*np.exp(-np.arange(n)/SR*10)[:len(duck[j:j+n])])
bed*=duck; L+=bed*.8; Rr+=bed*.8
# --- drums
for b in beats: add(kick(),b,gain=.95)
for k in range(40):
    s=2.25+k*.25
    if s<12.4 and not(4.4<s<6.5): add(hat(),s,pan=.3 if k%2 else -.3,gain=.22)
# --- impacts + transitions
add(boom()[:int(1.2*SR)]*.6,2.0,gain=.8)
add(crackle(2.4),2.05,pan=-.5,gain=.35); add(crackle(2.4),2.15,pan=.5,gain=.35)
for s in(4.3,6.3,8.3,10.3): add(whoosh(.55),s,gain=.5)
add(chime(1318.5,2),6.55,gain=.12); add(chime(1661,2),6.8,gain=.1)   # petals
for k in range(8): add(chime(2093*(1.0+k*.06),.4)*.5,8.55+k*.11,pan=rng.uniform(-.8,.8),gain=.12) # bubbles
add(riser(2.0),10.95,gain=.6)
# reverse swell into the boom
rev=filt(rng.standard_normal(int(.5*SR)),'high',3000)*np.linspace(0,1,int(.5*SR))**3; add(rev,12.5,gain=.5)
add(boom(),13.0,gain=1.0)
for i,f in enumerate([880,1108.7,1318.5,1760]): add(chime(f,1.8),13.35+i*.14,pan=(i-1.5)*.3,gain=.14)
add(crackle(1.8,400),13.1,gain=.25)
# --- master: soft clip, fades
mix=np.stack([L,Rr],1)
mix=np.tanh(mix*1.2)/np.tanh(1.2)
fade=np.ones(N); fi=int(.05*SR); fo=int(.6*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
mix*=fade[:,None]; mix/=np.max(np.abs(mix))*1.12
wavfile.write('soundtrack.wav',SR,(mix*32767).astype(np.int16))
print('ok',mix.shape)
